import { createAction } from "redux-actions";

import { registerNetworkRequest } from "../../networkers";

export const registerRequest = createAction("REGISTER_REQUEST");
export const registerSuccess = createAction("REGISTER_SUCCESS");
export const registerFailure = createAction("REGISTER_FAILURE");

export const register = (
  email,
  password,
  repeatPassword,
  firstName,
  lastName,
) => async (dispatch) => {
  dispatch(registerRequest());
  try {
    const response = await registerNetworkRequest(
      email,
      password,
      repeatPassword,
      firstName,
      lastName,
    );

    dispatch(registerSuccess());
    return response;
  } catch (e) {
    dispatch(registerFailure());
  };
};
