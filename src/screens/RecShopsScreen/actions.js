import { createAction } from "redux-actions";

import {
  getAllShopsFromCityNetworkRequest,
  getAllRecommendedShops,
  getPopularProducts,
  getAllShopsNetworkRequest,
  getUserShopsNetworkRequest,
} from "../../networkers";


export const getShopsRequest = createAction("GET_SHOPS_REQUEST");
export const getAllShopsSuccess = createAction("GET_ALL_SHOPS_SUCCESS");
export const getShopsFailure = createAction("GET_SHOPS_FAILURE");
export const getAllShopsSearchSuccess = createAction("GET_ALL_SHOPS_SEARCH_SUCCESS");
export const getUserShopsSuccess = createAction("GET_USER_SHOPS_SUCCESS");
export const getAllCityShopsSuccess = createAction("GET_ALL_CITY_SHOPS_SUCCESS");

export const getAllShops = () => async dispatch => {
  dispatch(getShopsRequest());
  Promise.all([getAllRecommendedShops(), getPopularProducts()])
  .then(results => {
    const shops = {};
    shops.recommended = results[0]
    shops.products = results[1];
    dispatch(getAllShopsSuccess({ shops }));
  })
  .catch(error => {
    dispatch(getShopsFailure({ error }));
  });
};

export const getAllCityShops = city => async dispatch => {
  dispatch(getShopsRequest());
  try {
    const cityShops = await getAllShopsFromCityNetworkRequest(city);

    dispatch(getAllCityShopsSuccess({ cityShops }));
  } catch (error) {
    dispatch(getShopsFailure({ error }));
  };
};

export const getAllShopsSearch = text => async dispatch => {
  dispatch(getShopsRequest());
  try {
    const shopsSearch = await getAllShopsNetworkRequest(text);

    dispatch(getAllShopsSearchSuccess({ shopsSearch }));
  } catch (error) {
    dispatch(getShopsFailure({ error }));
  };
};

export const getUserShops = () => async dispatch => {
  dispatch(getShopsRequest());
  try {
    const userShops = await getUserShopsNetworkRequest();

    dispatch(getUserShopsSuccess({ userShops }));
  } catch (error) {
    dispatch(getShopsFailure({ error }));
  };
};