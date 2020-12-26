import { createAction } from "redux-actions";

import { setCoopPrices, addPriceAction } from "../../../actions";
import { getCoopPricesNetworkRequest } from "../../../networkers";

export const getPricesRequest = createAction("GET_PRICES_REQUEST");
export const getPricesSuccess = createAction("GET_PRICES_SUCCESS");
export const getPricesFailure = createAction("GET_PRICES_FAILURE");

export const getCoopPrices = (userId,page) => async (dispatch, getState) => {
  dispatch(getPricesRequest());
  try {
    const response = await getCoopPricesNetworkRequest(userId, page);
    if (response.prices) {
      dispatch(setCoopPrices({ prices: response.prices }));
    }
    dispatch(getPricesSuccess());
  } catch (e) {
    dispatch(getPricesFailure());
  }
};

export const addPrice = newPrice => dispatch => {
  dispatch(addPriceAction({ newPrice }));
};
