import { createAction } from "redux-actions";
import {
  getCartSiteNetworkRequest,
  addItemInSiteNetworkRequest,
  deleteCartSiteNetworkRequest,
  newOrderNetworkRequest,
  setItemCountInSiteNetworkRequest,
} from "../../networkers";

export const getCartRequest = createAction("GET_CART_REQUEST");
export const getCartSuccess = createAction("GET_CART_SUCCESS");
export const getCartFailure = createAction("GET_CART_FAILURE");

export const addItemSiteRequest = createAction("ADD_ITEM_SITE_REQUEST");
export const addItemSiteSuccess = createAction("ADD_ITEM_SITE_SUCCESS");
export const addItemSiteFailure = createAction("ADD_ITEM_SITE_FAILURE");

export const setItemCountSiteRequest = createAction("SET_ITEM_COUNT_SITE_REQUEST");
export const setItemCountSiteSuccess = createAction("SET_ITEM_COUNT_SITE_SUCCESS");
export const setItemCountSiteFailure = createAction("SET_ITEM_COUNT_SITE_FAILURE");

export const deleteItemSiteRequest = createAction("DELETE_ITEM_SITE_REQUEST");
export const deleteItemSiteSuccess = createAction("DELETE_ITEM_SITE_SUCCESS");
export const deleteItemSiteFailure = createAction("DELETE_ITEM_SITE_FAILURE");

export const newOrderRequest = createAction("NEW_ORDER_REQUEST");
export const newOrderSuccess = createAction("NEW_ORDER_SUCCESS");
export const newOrderFailure = createAction("NEW_ORDER_FAILURE");

export const getCart = (id, token, refreshToken) => async (dispatch) => {
  dispatch(getCartRequest());
  try {
    const response = await getCartSiteNetworkRequest(id, token, refreshToken);
    const cart = response.cart.cart;
    const product = cart.map(el => {
      return {
        ...el.product,
        cartCount: +el.product.razmerme ? `${(+el.num).toFixed(1)}` : `${(+el.num).toFixed(0)}`,
        numberProductId: el.id,
        price_id: el.price_id,
      }
    });
    dispatch(getCartSuccess({ product }));
  } catch (e) {
    dispatch(getCartFailure());
  };
};

export const addItemSite = (id, num, price_id, source, token, refreshToken) => async (dispatch) => {
  dispatch(addItemSiteRequest());
  try {
    const response = await addItemInSiteNetworkRequest(id, num, price_id, source, token, refreshToken);
    dispatch(addItemSiteSuccess());
  } catch(e) {
    dispatch(addItemSiteFailure());
  };
};

export const setItemCountSite = (id, num, price_id, source, token, refreshToken) => async (dispatch) => {
  dispatch(setItemCountSiteRequest());
  try {
    const response = await setItemCountInSiteNetworkRequest(id, num, price_id, source, token, refreshToken);
    dispatch(setItemCountSiteSuccess());
  } catch(e) {
    dispatch(setItemCountSiteFailure());
  };
};

export const deleteItemSite = (numberProductId, token, refreshToken) => async (dispatch) => {
  dispatch(deleteItemSiteRequest());
  try {
    const response = await deleteCartSiteNetworkRequest(numberProductId, token, refreshToken);
    dispatch(deleteItemSiteSuccess());
  } catch(e) {
    dispatch(deleteItemSiteFailure());
  };
};

export const newOrderSend = (shop_id, comment_person, phone, is_sz, price_id, order, token, refreshToken) => async (dispatch) => {
  dispatch(newOrderRequest());
  try {
    const response = await newOrderNetworkRequest(shop_id, comment_person, phone, is_sz, price_id, order, token, refreshToken);
    console.log(response);
    dispatch(newOrderSuccess());
  } catch(e) {
    dispatch(newOrderFailure());
  };
};