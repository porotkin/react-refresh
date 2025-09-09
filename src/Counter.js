import {useCounterState} from "./useCounterState.js";
import {CounterStatus} from "./CounterStatus.js";
import {IncrementButton} from "./IncrementButton.js";
import RefreshRuntime from "./refresh-runtime/RefreshRuntime.js";
import {createElement, Fragment, memo} from "react";

function get_Counter1231412() {
    _init_properties_Counter()

    return CounterComponent
}

var CounterComponent;

const refresh = new RefreshRuntime(
    import.meta.hot,
    import.meta.url,
    (cb) => import.meta.hot.accept(cb),
)

function Counter() {
    refresh.refreshComponent()

    const [count, setCount] = useCounterState()

    return createElement(Fragment, null, [
        createElement("div", null, "Check Counter component HMR"),
        createElement(CounterStatus, {value: count}),
        createElement(IncrementButton, {setValue: setCount}),
    ])
}

var properties_initialized;

function _init_properties_Counter() {
    if (!properties_initialized) {
        properties_initialized = true;

        const fc = () => createElement(Counter, {})
        var tmp0 = memo(fc)
        var displayName = "Counter"
        if (!tmp0.displayName) {
            tmp0.displayName = displayName
        }

        CounterComponent = fc
    }
}

refresh.accept(Counter)

export {get_Counter1231412 as Counter,}
