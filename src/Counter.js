import {useCounterState} from "./useCounterState.js";
import {CounterStatus} from "./CounterStatus.js";
import {IncrementButton} from "./IncrementButton.js";
import {createElement, Fragment, memo} from "react";

function get_Counter() {
    _init_properties_Counter()

    return CounterComponent
}

var CounterComponent;

function Counter$lambda() {
    const [count, setCount] = useCounterState()

    return createElement(Fragment, {key: "Fragment"}, [
        createElement("div", {key: "Check"}, "Check Counter component HMR"),
        createElement(CounterStatus(), {key: "CounterStatus", value: count}),
        createElement(IncrementButton(), {key: "IncrementButton", setValue: setCount}),
    ])
}

var properties_initialized;

function _init_properties_Counter() {
    if (!properties_initialized) {
        properties_initialized = true;

        const fc = () => createElement(Counter$lambda, {})
        var tmp0 = memo(fc)
        var displayName = "Counter"
        if (!tmp0.displayName) {
            tmp0.displayName = displayName
        }

        CounterComponent = tmp0
    }

    return CounterComponent
}

export {get_Counter as Counter,}
