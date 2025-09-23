import {createFilter} from 'vite'
import {makeIdFiltersToMatchWithQuery} from "@rolldown/pluginutils";

function addRefreshWrapper(code, pluginName, id) {
    let preamble = `
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
let prevRefreshReg;
let prevRefreshSig;
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg(${JSON.stringify(id)});
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
`;

    const registerHmr = `
function normalizeExports(value) {
    const name = ${JSON.stringify(id)}.split("/").pop().replace(/.m?jsx?/, "");
    return {
        ...value,
        [name]: (...args) => value?.[name]?.(...args),
    }
}
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh(${JSON.stringify(id)}, currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate(${JSON.stringify(id)}, normalizeExports(currentExports), normalizeExports(nextExports));
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
    `

    return preamble + code + registerHmr;
}

let babel;

async function loadBabel() {
    if (!babel) babel = await import("@babel/core");
    return babel;
}

const defaultIncludeRE = /\.[tj]sx?$/;
const defaultExcludeRE = /\/node_modules\//;

const include = defaultIncludeRE;
const exclude = defaultExcludeRE;
const filter = createFilter(include, exclude);
let isProduction = true;
let projectRoot = process.cwd();
let skipFastRefresh = true;
let runPluginOverrides;

function canSkipBabel(plugins, babelOptions) {
    return !(plugins.length || babelOptions.presets.length || babelOptions.configFile || babelOptions.babelrc);
}

const loadedPlugin = /* @__PURE__ */ new Map();

function loadPlugin(path) {
    const cached = loadedPlugin.get(path);
    if (cached) return cached;
    const promise = import(path).then((module) => {
        const value = module.default || module;
        loadedPlugin.set(path, value);
        return value;
    });
    loadedPlugin.set(path, promise);
    return promise;
}

function createBabelOptions(rawOptions) {
    const babelOptions = {
        babelrc: false,
        configFile: false,
        ...rawOptions
    };
    babelOptions.plugins ||= [];
    babelOptions.presets ||= [];
    babelOptions.overrides ||= [];
    babelOptions.parserOpts ||= {};
    babelOptions.parserOpts.plugins ||= [];
    return babelOptions;
}

function defined(value) {
    return value !== void 0;
}

export default {
    name: "vite:react-babel",
    enforce: "pre",
    configResolved(config) {
        projectRoot = config.root;
        isProduction = config.isProduction;
        skipFastRefresh = isProduction || config.command === "build" || config.server.hmr === false;
        const hooks = config.plugins.map((plugin) => plugin.api?.reactBabel).filter(defined);
        if (hooks.length > 0) runPluginOverrides = (babelOptions, context) => {
            hooks.forEach((hook) => hook(babelOptions, context, config));
        };
    },
    transform: {
        filter: {
            id: {
                include: makeIdFiltersToMatchWithQuery("**/*.js"),
                exclude: [makeIdFiltersToMatchWithQuery("**/use*.js"), "**/*.jsx"],
            }
        },
        async handler(code, id, options) {
            const [filepath] = id.split("?");
            if (!filter(filepath)) return;
            const ssr = options?.ssr === true;
            const babelOptions = (() => {
                const newBabelOptions = createBabelOptions({});
                runPluginOverrides?.(newBabelOptions, {
                    id,
                    ssr
                });
                return newBabelOptions;
            })();
            const plugins = [...babelOptions.plugins];
            const useFastRefresh = !skipFastRefresh && /function/.test(code); // Can be FC/displayName/memo for K/JS
            if (useFastRefresh) plugins.push([await loadPlugin("react-refresh/babel"), {skipEnvCheck: true}]);
            if (canSkipBabel(plugins, babelOptions)) return;
            const parserPlugins = [...babelOptions.parserOpts.plugins];
            if (!filepath.endsWith(".ts")) parserPlugins.push("jsx");
            const result = await (await loadBabel()).transformAsync(code, {
                ...babelOptions,
                root: projectRoot,
                filename: id,
                sourceFileName: filepath,
                retainLines: !isProduction,
                parserOpts: {
                    ...babelOptions.parserOpts,
                    sourceType: "module",
                    allowAwaitOutsideFunction: true,
                    plugins: parserPlugins
                },
                generatorOpts: {
                    ...babelOptions.generatorOpts,
                    importAttributesKeyword: "with",
                    decoratorsBeforeExport: true
                },
                plugins,
                sourceMaps: true
            });
            if (result) {
                if (!useFastRefresh) return {
                    code: result.code,
                    map: result.map
                };
                return {
                    code: addRefreshWrapper(result.code, "@vitejs/plugin-react", id) ?? result.code,
                    map: result.map
                };
            }
        }
    }
}
