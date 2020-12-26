import { createAction } from "redux-actions";

export const getUserTokenRequest = createAction("GET_USER_TOKEN_REQUEST");
export const getUserTokenSuccess = createAction("GET_USER_TOKEN_SUCCESS");

export const getUserProfileRequest = createAction("GET_USER_PROFILE_REQUEST");
export const getUserProfileSuccess = createAction("GET_USER_PROFILE_SUCCESS");

export const logOutRequest = createAction("LOGOUT_REQUEST");
export const logOutSuccess = createAction("LOGOUT_SUCCESS");
