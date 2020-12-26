import { createAction } from "redux-actions";

import {
  setPrices,
  addPriceAction,
  renewPrices,
  getCartLength,
  getCartSZ_Length,
} from "../../actions";
import { getPricesNetworkRequest, fetchCarts, fetchCarts_SZ } from "../../networkers";

export const getPricesRequest = createAction("GET_PRICES_REQUEST");
export const getPricesSuccess = createAction("GET_PRICES_SUCCESS");
export const getPricesFailure = createAction("GET_PRICES_FAILURE");

export const getPrices = (userId, page) => async (dispatch) => {
  dispatch(getPricesRequest());
  try {
    const response = await getPricesNetworkRequest(userId, page);

    if (response.prices) {
      dispatch(setPrices({ prices: response.prices }));
    }
    dispatch(getPricesSuccess());
  } catch(e) {
    dispatch(getPricesFailure());
  }
};

export const addPrice = newPrice => dispatch => {
  dispatch(addPriceAction({ newPrice }));
};

export const renewPriceList = (userId, page) => async dispatch => {
  dispatch(getPricesRequest());
  try {
    const response = await getPricesNetworkRequest(userId, page);

    if (response.prices) {
      dispatch(renewPrices({ prices: response.prices }));
    }
    dispatch(getPricesSuccess());
  } catch(e) {
    dispatch(getPricesFailure());
  }
};

export const addCartLength = () => async (dispatch) => {
  try {
    const response = await fetchCarts();
    dispatch(getCartLength({ cartLength: response.cart.length }));
  } catch(e) {
    dispatch(getCartLength({ cartLength: 0 }));
  }
};

export const addCartSZ_Length = () => async (dispatch) => {
  try {
    const response = await fetchCarts_SZ();
    dispatch(getCartSZ_Length({ cartSZ_Length: response.carts.length }));
  } catch(e) {
    dispatch(getCartSZ_Length({ cartSZ_Length: 0 }));
  }
};