import { createAction } from "redux-actions";

import { sendPhotoNetworkRequest, savePhotoNetworkRequest } from "../../networkers";
import { deleteAccessToken, logOutRequest, logOutSuccess, addPhotoToProfile } from "../../actions";
import { deleteUserToken, deleteUserProfile } from "../../utils";
import { AUTHENTICATION_SCREEN } from "../../constants";

import NavigationService from "../../navigationService/NavigationService";
import { AsyncStorage } from "react-native";

export const logOut = () => async dispatch => {
  dispatch(logOutRequest());
  dispatch(deleteAccessToken());
  await deleteUserToken();
  await deleteUserProfile();
  await AsyncStorage.setItem('chat-token','')
  dispatch(logOutSuccess());

  NavigationService.navigate(AUTHENTICATION_SCREEN);
};

export const sendPhotoRequest = createAction("SEND_PHOTO_REQUEST");
export const sendPhotoSuccess = createAction("SEND_PHOTO_SUCCESS");
export const sendPhotoFailure = createAction("SEND_PHOTO_FAILURE");

export const sendPhoto = photo => async dispatch => {
  dispatch(sendPhotoRequest());
  try {
    const response = await parseInt(sendPhotoNetworkRequest(photo));
    dispatch(sendPhotoSuccess());
  } catch(error) {
    dispatch(sendPhotoFailure({ error }));
  };
};

export const savePhotoRequest = createAction("SAVE_PHOTO_REQUEST");
export const savePhotoSuccess = createAction("SAVE_PHOTO_SUCCESS");
export const savePhotoFailure = createAction("SAVE_PHOTO_FAILURE");

export const savePhoto = data => async dispatch => {
  dispatch(savePhotoRequest());
  try {
    const response = await savePhotoNetworkRequest(data);
    dispatch(savePhotoSuccess());
  } catch(error) {
    dispatch(savePhotoFailure({ error }));
  };
};

export const addPhoto = phonePhoto => dispatch => {
  dispatch(addPhotoToProfile({ phonePhoto }));
};
