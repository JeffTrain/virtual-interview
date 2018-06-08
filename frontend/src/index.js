import React from 'react';
import * as ReactDOM from "react-dom";
import App from './js/components/App.js';
import store from './js/store/index'
import {Provider} from "react-redux";


ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById("root")
)