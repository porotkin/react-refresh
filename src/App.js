import './App.css'
import {Counter} from "./Counter.js";
import {createElement, Fragment} from "react";

function get_App() {
    return App$lambda
}

function App$lambda() {
    return createElement(Fragment, {key: "App"},
        [
            createElement(Counter(), {key: "Counter"}),
            createElement("div", {key: "Container"}, "App HMR"),
        ]
    )
}

export {get_App as App,}
