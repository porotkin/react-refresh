import './App.css'
import {Counter} from "./Counter.js";
import RefreshRuntime from "./refresh-runtime/RefreshRuntime.js";
import {createElement, Fragment} from "react";

const refresh = new RefreshRuntime(
    import.meta.hot,
    import.meta.url,
    (cb) => import.meta.hot.accept(cb),
)

function get_App() {
    refresh.refreshComponent()

    return createElement(Fragment, {key: "get_App"},
        [
            createElement(Counter(), null),
            createElement("div", null, "App HMR"),
        ]
    )
}

refresh.accept(get_App)

export {get_App as App,}
