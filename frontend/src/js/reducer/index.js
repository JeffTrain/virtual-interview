import {ADD_VIDEO} from "../constants/action-types";

const initialState = {
    videos: []
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_VIDEO:
            return {
                ...state,
                videos: state.videos.concat(action.payload)
            };
        default:
            return state;
    }
};

export default rootReducer;