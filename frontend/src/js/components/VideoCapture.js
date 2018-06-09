import * as React from "react";
import {Button} from 'semantic-ui-react'

export default class VideoCapture extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            downloadLink: null,
            recording: false,
            loading: false,
            stream: null
        }

        this.openCam = this.openCam.bind(this)
        this.closeCam = this.closeCam.bind(this);
    }

    async openCam() {
        this.setState({loading: true})

        let stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });

        document.getElementById('video').srcObject = stream;

        this.starRecording(stream);

        this.setState({
            recording: true,
            loading: false,
            stream: stream
        })
    }

    closeCam() {
        document.getElementById('video').srcObject = null;
        this.media.stop();
        this.setState({
            recording: false,
            stream: null
        })
    }

    render() {
        return (<div>
            {
                !this.state.recording ?
                    <Button className="ui button positive" type="button" onClick={this.openCam}
                            loading={this.state.loading}>打开摄像头</Button> :
                    <Button className="ui button negative" type="button" onClick={this.closeCam}
                            loading={this.state.loading}>关闭摄像头</Button>
            }
            <div>
                <video id="video" autoPlay></video>
            </div>
            {
                this.state.recording === false &&
                <a href={this.state.downloadLink} download={this.state.downloadName} name={this.state.downloadName}
                   id="download-load" target="_blank">下载视频 </a>
            }
        </div>)
    }

    starRecording(stream) {
        this.media = new MediaRecorder(stream, {mimeType: 'video/webm;codecs=vp8'});
        this.media.start(5);

        let url = window.URL || window.webkitURL;
        this.chunks = [];

        this.media.ondataavailable = e => {
            this.chunks.push(e.data);
        }

        this.media.onstart = () => {
            this.setState({recording: true});
        }

        this.media.onstop = () => {
            let blob = new Blob(this.chunks, {type: 'video/webm'});
            this.chunks = [];

            let videoURL = url.createObjectURL(blob);
            let rand = Math.floor(Math.random() * 100000000)
            let filename = `video_${rand}.webm`;

            this.setState({
                downloadLink: videoURL,
                downloadName: filename,
                recording: false
            });
        }
    }
}