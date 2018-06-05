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
            loading: false,
            url: "",
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

    async handleSubmit(event) {
        event.preventDefault();

        await this.uploadVideoToServer();

        const {title, url} = this.state;
        const id = uuidv1();
        this.props.addVideo({title, url, id});
        this.setState({title: ""});
    }

    componentDidMount() {
        this.video = document.querySelector('video');
        this.downloadLink = document.querySelector('#download-link');
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
                    {
                        this.state.recording === false &&
                        <a href={this.state.downloadLink} download={this.state.downloadName}
                           name={this.state.downloadName}
                           id="download-link" target="_blank">下载视频</a>
                    }
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {
                        this.state.recording === false &&
                        <a href={this.state.audioDownloadLink} download={this.state.audioDownloadName}
                           name={this.state.audioDownloadName} id="audio-download-link" target="_blank">下载音频</a>
                    }
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

            this.startRecording(stream);

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

            this.stopRecording();

            this.setState({
                stream: null
            });
        } catch (ex) {
            console.error(ex);
        }
    }

    startRecording(stream) {
        let options = undefined;
        if (typeof MediaRecorder.isTypeSupported === 'function') {
            if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9') && false) {
                options = {mimeType: 'video/webm;codecs=vp9'};
            } else if (MediaRecorder.isTypeSupported('video/webm;codecs=h264')) {
                options = {mimeType: 'video/webm;codecs=h264'};
            } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
                options = {mimeType: 'video/webm;codecs=vp8'};
            }
        }

        this.mediaRecorder = new MediaRecorder(stream, options);
        this.audioRecorder = new MediaRecorder(stream, {
            type: 'audio/wav',
            gUM: {audio: true},
            tag: 'audio',
            ext: '.wav',
            mimeType: ''
        });

        this.mediaRecorder.start(10);
        this.audioRecorder.start(10);

        let url = window.URL || window.webkitURL;

        this.chunks = [];
        this.audioChunks = [];

        this.mediaRecorder.ondataavailable = e => {
            this.chunks.push(e.data);
        };
        this.audioRecorder.ondataavailable = e => {
            this.audioChunks.push(e.data);
        };
        this.mediaRecorder.onerror = (e) => {
            console.error(e);
        };
        this.audioRecorder.onerror = (e) => {
            console.error(e);
        };
        this.mediaRecorder.onstart = () => {
            this.setState({recording: true});
        };
        this.audioRecorder.onstart = () => {
            this.setState({recording: true});
        }
        this.mediaRecorder.onstop = () => {
            let blob = new Blob(this.chunks, {type: "video/mp4"});
            this.blob = blob

            this.chunks = [];

            let videoURL = window.URL.createObjectURL(blob);
            let rand = Math.floor(Math.random() * 1000000000);
            let name = `video_${rand}.webm`;
            this.name = name;
            this.setState({
                downloadLink: videoURL,
                downloadName: name,
                recording: false
            });
        };
        this.audioRecorder.onstop = () => {
            let blob = new Blob(this.audioChunks, {type: 'audio/wav'});
            this.audioBlob = blob;

            this.audioChunks = [];

            let audioURL = window.URL.createObjectURL(blob);
            let rand = Math.floor(Math.random() * 100000000000);
            let name = `audio_${rand}.wav`;
            this.audioName = name;

            this.setState({
                audioDownloadLink: audioURL,
                audioDownloadName: name,
                recording: false
            })
        }
        this.mediaRecorder.onpause = () => {

        };
        this.audioRecorder.onpause = () => {

        };
        this.mediaRecorder.onresume = () => {

        };
        this.audioRecorder.onresume = () => {

        }
        this.mediaRecorder.onwarning = () => {

        };
        this.audioRecorder.onwarning = () => {

        }
    }

    stopRecording() {
        this.mediaRecorder.stop();
        this.audioRecorder.stop();
    }

    async uploadVideoToServer() {
        let url = `http://localhost:5000/upload`
        let payload = new FormData()
        payload.append('file', this.blob, this.name)
        payload.append('audio', this.audioBlob, this.audioName)
        let data = {
            method: 'POST',
            body: payload
        }
        let result = await fetch(url, data);
        console.log('result = ', result.url);
        this.setState({url: result.url});
    }
}

const Form = connect(null, mapDispatchToProps)(ConnectedForm);

export default Form;