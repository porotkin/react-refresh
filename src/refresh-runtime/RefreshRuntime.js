import * as RefreshRuntime from "/@react-refresh";

class ReactRefresh {
    rememberValues() {
        this.prevRefreshReg = window.$RefreshReg$;
        this.prevRefreshSig = window.$RefreshSig$;
    }

    restoreDefaults() {
        window.$RefreshReg$ = this.prevRefreshReg;
        window.$RefreshSig$ = this.prevRefreshSig;
    }

    constructor(context, url, acceptHmr) {
        this.context = context;
        this.url = url;
        this.acceptHmr = acceptHmr;

        this.moduleId = new URL(url).pathname;

        this.prevRefreshReg = null;
        this.prevRefreshSig = null;

        this.refreshSigFn = null;

        if (context != null) {
            if (window.$RefreshReg$ == null) {
                throw new Error("Can't detect React Refresh preamble");
            }

            this.rememberValues();

            window.$RefreshReg$ = RefreshRuntime.getRefreshReg(this.moduleId);
            window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;

            this.refreshSigFn = window.$RefreshSig$()
        }
    }

    refreshComponent() {
        this.refreshSigFn();
    }

    applySignalToFC(component) {
        this.refreshSigFn(component, this.moduleId, false, () => []);
        window.$RefreshReg$(component, component?.displayName ?? component.name);
    }

    normalizeExport(value) {
        const name = this.moduleId.split("/").pop().replace(".js", "");
        return {
            ...value,
            [name]: (...args) => value?.[name]?.(...args),
        }
    }

    acceptHmrUpdate() {
        if (this.context != null) {
            RefreshRuntime.__hmr_import(this.moduleId).then(currentExports => {
                this.acceptHmr(nextExports => {
                    const validationResult = RefreshRuntime
                        .validateRefreshBoundaryAndEnqueueUpdate(this.moduleId, currentExports, this.normalizeExport(nextExports));

                    if (validationResult != null) {
                        this.context.invalidate(validationResult);
                    }
                });
            });
        }
    }

    accept(component) {
        this.applySignalToFC(component);
        this.restoreDefaults();
        this.acceptHmrUpdate();
    }
}

export default ReactRefresh;
