import RefreshRuntime from "./refresh-runtime/RefreshRuntime.js";

const refresh = new RefreshRuntime(
    import.meta.hot,
    import.meta.url,
    (cb) => import.meta.hot.accept(cb),
)

function get_CounterStatus({value}) {
    refresh.refreshComponent()
    return (
        <>
            <div>
                Current value is {value}
            </div>
        </>
    )
}

refresh.accept(get_CounterStatus)

export {get_CounterStatus as CounterStatus,}
