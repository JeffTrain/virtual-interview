import {addVideo} from "../actions/index";
import * as React from "react";
import {connect} from "react-redux";
import uuidv1 from 'uuid';
import VideoCapture from "./VideoCapture";

const mapDispatchToProps = dispatch => ({
    addVideo: video => dispatch(addVideo(video))
});

class ConnectedForm extends React.Component {
    constructor() {
        super();

        this.state = {
            title: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            title: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const {title} = this.state;
        const id = uuidv1();
        this.props.addVideo({title, id});
        this.setState({title: ""})
    }

    render() {
        const {title} = this.state;

        return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">标题</label>
                    <input type="text" className="form-control" id="title" value={title} onChange={this.handleChange}/>
                </div>
                <div>
                    <VideoCapture/>
                </div>
                <div>
                    <button type="submit" className="btn btn-success btn-lg">保存</button>
                </div>
            </form>
        )
    }
}

const Form = connect(null, mapDispatchToProps)(ConnectedForm);

export default Form;