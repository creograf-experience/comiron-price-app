import { createAction } from "redux-actions";

export const setAccessToken = createAction("SET_ACCESS_TOKEN");
export const deleteAccessToken = createAction("DELETE_ACCESS_TOKEN");

export const setError = createAction("SET_ERROR");
