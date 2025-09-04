import {useCallback, useState} from "react";

export function useCounterState() {
    const [count, setCount] = useState(0);

    const updateCount = useCallback(() => {
        setCount(count + 1)
    }, [count])

    return [count, updateCount]
}
