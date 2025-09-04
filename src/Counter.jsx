import {useCounterState} from "./useCounterState.js";
import CounterStatus from "./CounterStatus.jsx";
import IncrementButton from "./IncrementButton.jsx";

function Counter() {
    const [count, setCount] = useCounterState()

    return (
        <>
            <CounterStatus value={count}/>
            <IncrementButton setValue={setCount}/>
        </>
    )
}

export default Counter
