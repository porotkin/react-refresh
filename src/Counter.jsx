import {useCounterState} from "./useCounterState.js";
import {CounterStatus} from "./CounterStatus.jsx";
import {IncrementButton} from "./IncrementButton.jsx";
import RefreshRuntime from "./refresh-runtime/RefreshRuntime.js";

const refresh = new RefreshRuntime(
    import.meta.hot,
    import.meta.url,
    (cb) => import.meta.hot.accept(cb),
)

function get_Counter() {
    refresh.refreshComponent()

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [count, setCount] = useCounterState()

    return (
        <>
            <CounterStatus value={count}/>
            <IncrementButton setValue={setCount}/>
        </>
    )
}

refresh.accept(get_Counter)

export {get_Counter as Counter,}
