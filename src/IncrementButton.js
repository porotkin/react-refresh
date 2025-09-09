import RefreshRuntime from "./refresh-runtime/RefreshRuntime.js";
import {createElement} from "react";

const refresh = new RefreshRuntime(
    import.meta.hot,
    import.meta.url,
    (cb) => import.meta.hot.accept(cb),
)

function get_IncrementButton({setValue}) {
    refresh.refreshComponent()
    return createElement(
        "button",
        {onClick: setValue},
        "Increment",
    )
}

refresh.accept(get_IncrementButton)

export {get_IncrementButton as IncrementButton}
