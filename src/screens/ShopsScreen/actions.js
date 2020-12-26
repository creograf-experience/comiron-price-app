import { createAction } from "redux-actions";

import {
  getUserShopsNetworkRequest,
  getAllShopsNetworkRequest,
  showAllShopsNetworkRequest,
} from "../../networkers";


export const getShopsRequest = createAction("GET_SHOPS_REQUEST");
export const getUserShopsSuccess = createAction("GET_USER_SHOPS_SUCCESS");
export const getAllShopsSuccess = createAction("GET_ALL_SHOPS_SUCCESS");
export const showAllShopsSuccess = createAction("SHOW_ALL_SHOPS_SUCCESS");
export const getShopsFailure = createAction("GET_SHOPS_FAILURE");

export const getUserShops = userID => async dispatch => {
  dispatch(getShopsRequest());
  try {
    const shops = await getUserShopsNetworkRequest(userID);

    dispatch(getUserShopsSuccess({ shops }));
  } catch (error) {
    dispatch(getShopsFailure({ error }));
  };
};

export const getAllShops = text => async dispatch => {
  dispatch(getShopsRequest());
  try {
    const shops = await getAllShopsNetworkRequest(text);

    dispatch(getAllShopsSuccess({ shops }));
  } catch (error) {
    dispatch(getShopsFailure({ error }));
  };
};

export const showAllShops = () => async dispatch => {
  dispatch(getShopsRequest());
  try {
    const allShops = await showAllShopsNetworkRequest();

    dispatch(showAllShopsSuccess({ allShops }));
  } catch (error) {
    dispatch(getShopsFailure({ error }));
  };
};
