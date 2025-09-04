import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Counter} from "./Counter.jsx";
import RefreshRuntime from "./refresh-runtime/RefreshRuntime.js";

const refresh = new RefreshRuntime(
    import.meta.hot,
    import.meta.url,
    (cb) => import.meta.hot.accept(cb),
)

function get_App() {
    refresh.refreshComponent()

    return (
        <>
            <div>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo"/>
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo"/>
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <Counter/>
                <p>
                    Edit <code>src/App.jsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    )
}

refresh.accept(get_App)

export {get_App as App,}
