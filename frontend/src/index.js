import React from 'react';
import * as ReactDOM from "react-dom";
import App from './js/App.js';
import {addVideo} from "./js/actions/index";
import store from './js/store/index'

window.store = store;
window.addVideo = addVideo;

ReactDOM.render(
    <App/>,
    document.getElementById("root")
)