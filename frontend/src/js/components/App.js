import * as React from "react";
import List from './List';
import Form from "./Form";
import 'bootstrap/dist/css/bootstrap.min.css'
import store from '../store/index'
import {addVideo} from '../actions/index'

window.store = store;
window.addVideo = addVideo;


export const App = () =>
    <div className="row mt-5">
        <div className="col-md-4 offset-md-1">
            <h2>视频列表</h2>
            <List/>
        </div>
        <div>
            <Form></Form>
        </div>
    </div>;

export default App;