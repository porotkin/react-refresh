import RefreshRuntime from "./refresh-runtime/RefreshRuntime.js";

const refresh = new RefreshRuntime(
    import.meta.hot,
    import.meta.url,
    (cb) => import.meta.hot.accept(cb),
)

function get_IncrementButton({setValue}) {
    refresh.refreshComponent()
    return (
        <>
            <div>
                <button onClick={setValue}>Increment</button>
            </div>
        </>
    )
}

refresh.accept(get_IncrementButton)

export {get_IncrementButton as IncrementButton}
