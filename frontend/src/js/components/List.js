import React from "react";
import {connect} from "react-redux";

const mapStateToProps = state => ({videos: state.videos})

const ConnectedList = ({videos}) => (
    <ul className="list-group list-group-flush">
        {
            videos.map(video => (
                    <li className="list-group-item" key={video.id}>
                        {video.title}
                    </li>
                )
            )
        }
    </ul>
)


const List = connect(mapStateToProps)(ConnectedList);

export default List;