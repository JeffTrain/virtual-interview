import React from 'react';
import {connect} from "react-redux";

const mapStateToProps = state => {
    return {
        videos: state.videos
    };
};

const ConnectedList = ({videos}) => (
    <ul className="list-group list-group-flush">
        {videos.map(el => (
            <li className="list-group-item" key={el.id}>
                {el.title}: <a href={el.url} target="_blank">{el.url}</a>
            </li>
        ))
        }
    </ul>
);

const List = connect(mapStateToProps)(ConnectedList);

export default List;