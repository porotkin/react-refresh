import RefreshRuntime from "./refresh-runtime/RefreshRuntime.js";
import {createElement} from "react";

const refresh = new RefreshRuntime(
    import.meta.hot,
    import.meta.url,
    (cb) => import.meta.hot.accept(cb),
)

function get_CounterStatus({value}) {
    refresh.refreshComponent()
    return createElement(
        "div",
        null,
        "Current value is ",
        value,
    )
}

refresh.accept(get_CounterStatus)

export {get_CounterStatus as CounterStatus,}
