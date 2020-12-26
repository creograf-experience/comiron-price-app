import { createAction } from "redux-actions";

import NavigationService from "../../navigationService/NavigationService";

import { MAIN_SCREEN } from "../../constants";
import { logInNetworkRequest, checkProfileNetworkRequest } from "../../networkers";
import { setAccessToken, setError, connectSocket } from "../../actions";
import { saveUserToken, saveUserProfile } from "../../utils";
import { CONNECT_SOCKET } from "../../actions";
export const logInRequest = createAction("LOG_IN_REQUEST");
export const logInSuccess = createAction("LOG_IN_SUCCESS");
export const logInFailure = createAction("LOG_IN_FAILURE");
export const checkProfileRequest = createAction("CHECK_PROFILE_REQUSET");
export const checkProfileSuccess= createAction("CHECK_PROFILE_SUCCESS");
export const checkProfileFailure= createAction("CHECK_PROFILE_FAILURE");
export const addPhone = createAction("ADD_PHONE");
export const addPerson = createAction("ADD_PERSON");

export const logIn = (login, password) => async (dispatch) => {
  dispatch(logInRequest());

  const response = await logInNetworkRequest(login, password);
  switch (response.code) {
    case 200:
      dispatch(setAccessToken({ token: response.token, refreshToken: response.refreshToken }));
      await saveUserToken(response.token, response.refreshToken);
      await saveUserProfile(Object.values(response.user).join("~~")); // save user profile as string
      dispatch(logInSuccess());
      break;
    case 401:
      dispatch(setError({ error: response.status }));
      dispatch(logInFailure());
      break;
    default:
      dispatch(setError({ error: "Server error" }));
      dispatch(logInFailure());
      break;
  }
};

export const checkProfile = (token, refreshToken) => async (dispatch) => {
  dispatch(checkProfileRequest());
  try {
    const res = await checkProfileNetworkRequest(token,refreshToken);
    const phone = res.person.phone;
    const replaceNumber=phone.replace(/\D/g, '');
    const person = {
      contactName: `${res.person.first_name} ${res.person.last_name}`,
      thumbnail_url: res.person.thumbnail_url
    };
    const checkId = res.person.id;
    dispatch(addPhone({phone:replaceNumber}))
    dispatch(addPerson({person}))
    dispatch(checkProfileSuccess({ checkId }));
  }
  catch(error) {
    dispatch(checkProfileFailure({ error }));
  }
};