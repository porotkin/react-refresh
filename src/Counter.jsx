import {useCounterState} from "./useCounterState.js";
import CounterStatus from "./CounterStatus.jsx";
import IncrementButton from "./IncrementButton.jsx";
import RefreshRuntime from "./refresh-runtime/RefreshRuntime.js";

const refresh = new RefreshRuntime(
    import.meta.hot,
    import.meta.url,
    (cb) => import.meta.hot.accept(cb),
)

function Counter() {
    refresh.refreshComponent()

    const [count, setCount] = useCounterState()

    return (
        <>
            <CounterStatus value={count}/>
            <IncrementButton setValue={setCount}/>
        </>
    )
}

refresh.accept(Counter)

export default Counter
