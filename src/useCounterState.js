import {useEffect, useState} from "react";

export function useCounterState() {
    useEffect(() => {
        console.log("useCounterState")
    }, []);

    return useState(0)
}
