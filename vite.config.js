import {defineConfig} from 'vite'
// TODO: Remove this plugin
import react from '@vitejs/plugin-react'
import {makeIdFiltersToMatchWithQuery} from "@rolldown/pluginutils";

function addRefreshWrapper(code, pluginName, id) {
    const componentName = id.split("/").pop().replace(".js", "");

    const refreshPreabmle = `
// # region [${pluginName}]    
import RefreshRuntime from "./refresh-runtime/RefreshRuntime.js";
const refresh = new RefreshRuntime(
    import.meta.hot,
    import.meta.url,
    (cb) => import.meta.hot.accept(cb),
)
// # endregion

`

    // TODO: Detect react hooks and store them inside this call as an array
    let newCode = code.replace(
        new RegExp(`function ${componentName}\\$lambda\\((\\$this\\$FC)?\\) {`, "g"),
        (sub) => `${refreshPreabmle} ${sub}   refresh.refreshComponent()`,
    );

    newCode += `
    
// # region [${pluginName}]    
refresh.accept(${componentName}$lambda)
// # endregion
`;

    return newCode;
}

const viteRefreshWrapper = {
    name: "vite:react:refresh-wrapper-test",
    apply: "serve",
    transform: {
        filter: {
            id: {
                include: makeIdFiltersToMatchWithQuery("**/*.js"),
                exclude: [
                    makeIdFiltersToMatchWithQuery("**/use*.js"),
                    "**/refresh-runtime/*.js",
                    "**/main.js",
                ],
            }
        },
        handler(code, id) {
            const newCode = addRefreshWrapper(code, "@vitejs/plugin-react-kjs-refresh", id);

            return newCode ? {
                code: newCode,
                map: null
            } : void 0;
        }
    }
}

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react({
            include: '',
        }),
        [
            viteRefreshWrapper,
        ],
    ],
})
