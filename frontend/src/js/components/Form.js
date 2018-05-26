import React, {Component} from 'react';
import uuidv1 from 'uuid';
import {addVideo} from "../actions/index";
import {connect} from "react-redux";

const mapDispatchToProps = dispatch => {
    return {
        addVideo: video => dispatch(addVideo(video))
    };
};

const hasGetUserMedia = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

class ConnectedForm extends Component {
    constructor() {
        super();

        this.state = {
            title: "",
            stream: null,
            loading: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.openWebCam = this.openWebCam.bind(this);
        this.closeWebCam = this.closeWebCam.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const {title} = this.state;
        const id = uuidv1();
        this.props.addVideo({title, id});
        this.setState({title: ""});
    }

    componentDidMount() {
        this.video = document.querySelector('video');
    }

    render() {
        const {title} = this.state;
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">问题</label>
                    <input type="text" className="form-control" id="title" value={title} onChange={this.handleChange}/>
                </div>
                <p>
                    {
                        !this.state.stream &&
                        <button type="button" className="btn btn-success btn-lg" onClick={this.openWebCam}
                                disabled={this.state.loading}>
                            打开摄像头</button>
                    }
                    {
                        this.state.stream &&
                        <button type="button" className="btn btn-success btn-lg" onClick={this.closeWebCam}>
                            关闭摄像头</button>
                    }
                    <video autoPlay></video>
                </p>
                <p>
                    <button type="submit" className="btn btn-success btn-lg">保存</button>
                </p>
            </form>
        )
    }

    async openWebCam() {
        if (!hasGetUserMedia()) {
            alert('你的浏览器不支持这个功能！');
            return;
        }

        try {
            this.setState({loading: true});
            let stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            this.setState({
                stream: stream
            }, () => {
                this.video.srcObject = stream;
                this.setState({loading: false});
            });
        } catch (ex) {
            console.error(ex);
        }
    }

    async closeWebCam() {
        try {
            let audioTracks = this.video.srcObject.getAudioTracks();
            audioTracks.forEach(track => track.stop());

            let videoTracks = this.video.srcObject.getVideoTracks();
            videoTracks.forEach(t => t.stop());

            this.setState({
                stream: null
            });
        } catch (ex) {
            console.error(ex);
        }
    }
}

const Form = connect(null, mapDispatchToProps)(ConnectedForm);

export default Form;