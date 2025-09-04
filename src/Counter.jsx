import {useCounterState} from "./useCounterState.js";

function Counter() {
    const [count, setCount] = useCounterState()

    return (
        <>
            <div>
                I count to ${count}
            </div>

            <div>
                Increment here:
                <button onClick={() => setCount(prev => prev + 1)}>Click me</button>
            </div>
        </>
    )
}

export {
    Counter as Counter1,
}
