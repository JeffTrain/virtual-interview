import {ADD_VIDEO} from "../constants/action-types";

export const addVideo = video => ({
    type: ADD_VIDEO,
    payload: video
});