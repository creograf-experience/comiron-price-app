import { createAction } from "redux-actions";

import {
  getShopPricesNetworkRequest,
  getShopInfoNetworkRequest,
  addClientNetworkRequest,
  deleteShopNetworkRequest,
  postCallManagerNetworkRequest,
} from "../../networkers";

import { setGroups } from "../GroupScreen/actions";

export const getShopInfoRequest = createAction("GET_SHOP_INFO_REQUEST");
export const getShopInfoSuccess = createAction("GET_SHOP_INFO_SUCCESS");
export const getShopInfoFailure = createAction("GET_SHOP_INFO_FAILURE");
export const getShopPricesRequest = createAction("GET_SHOP_PRICES_REQUEST");
export const getShopPricesSuccess = createAction("GET_SHOP_PRICES_SUCCESS");
export const getShopPricesFailure = createAction("GET_SHOP_PRICES_FAILURE");
export const addClientRequest = createAction("ADD_CLIENT_REQUEST");
export const addClientSuccess = createAction("ADD_CLIENT_SUCCESS");
export const addClientFailure = createAction("ADD_CLIENT_FAILURE");
export const deleteShopRequest = createAction("DELETE_SHOP_REQUEST");
export const deleteShopSuccess = createAction("DELETE_SHOP_SUCCESS");
export const deleteShopFailure = createAction("DELETE_SHOP_FAILURE");
export const callManagerRequest = createAction("CALL_MANAGER_REQUEST");
export const callManagerSuccess = createAction("CALL_MANAGER_SUCCESS");
export const callManagerFailure = createAction("CALL_MANAGER_FAILURE");

export const clearGroups = createAction("CLEAR_GROUPS");

export const getShopPrices = (shopID, i, userID) => async dispatch => {
  dispatch(getShopPricesRequest());
  try {
    const prices = await getShopPricesNetworkRequest(shopID, i, userID);

    dispatch(getShopPricesSuccess({ prices }));
  } catch (error) {
    dispatch(getShopPricesFailure({ error }));
  };
};

export const getShopInfo = shopID => async dispatch => {
  dispatch(getShopInfoRequest());
  try {
    const shop = await getShopInfoNetworkRequest(shopID);
    dispatch(setGroups({ groups: shop.groups ? shop.groups : [] }));
    dispatch(getShopInfoSuccess({ shop }));
  } catch (error) {
    dispatch(getShopInfoFailure({ error }));
  };
};

export const renewShopList = shopID => async dispatch => {
  dispatch(getShopInfoRequest());
  try {
    const shop = await getShopInfoNetworkRequest(shopID);
    dispatch(setGroups({ groups: shop.groups }));
    dispatch(getShopInfoSuccess({ shop }));
  } catch (error) {
    dispatch(getShopInfoFailure({ error }));
  };
};

export const addClient = (shopID, token, refreshToken) => async dispatch => {
  dispatch(addClientRequest());
  try {
    const status = await addClientNetworkRequest(shopID, token, refreshToken);
    dispatch(addClientSuccess({ status }));
  } catch (error) {
    dispatch(addClientFailure(error))
  };
};

export const deleteShop = (shopID, token, refreshToken) => async dispatch => {
  dispatch(deleteShopRequest());
  try {
    const status = await deleteShopNetworkRequest(shopID, token, refreshToken);
    dispatch(deleteShopSuccess({ status }));
  } catch (error) {
    dispatch(deleteShopFailure({ error }))
  };
};

export const callManager = (person) => async dispatch => {
  dispatch(callManagerRequest());
  try {
    const status = await postCallManagerNetworkRequest(person);
    dispatch(callManagerSuccess({ status }));
  } catch (error) {
    dispatch(callManagerFailure(error))
  };
};