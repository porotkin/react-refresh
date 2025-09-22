import {createElement} from "react";

function get_IncrementButton() {
    return IncrementButton$lambda
}

function IncrementButton$lambda($this$FC) {
    return createElement(
        "button",
        {onClick: $this$FC.setValue},
        "Increment",
    )
}

export {get_IncrementButton as IncrementButton}
