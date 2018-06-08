import * as React from "react";
import List from './List';
import Form from "./Form";

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