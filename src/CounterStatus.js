import {createElement} from "react";

function get_CounterStatus() {
    return CounterStatus$lambda
}

function CounterStatus$lambda($this$FC) {
    return createElement(
        "div",
        null,
        "Current value is ",
        $this$FC.value,
    )
}

export {get_CounterStatus as CounterStatus,}
