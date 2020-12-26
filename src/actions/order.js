import { createAction } from "redux-actions";

import {
  sendOrderNetworkRequest,
  updateOrderNetworkRequest
} from "../networkers";

export const resetSendOrderResponse = createAction("RESET_SEND_ORDER_RESPONSE");
export const resetSendOrderError = createAction("RESET_SEND_ORDER_ERROR");

export const sendOrderRequest = createAction("SEND_ORDER_REQUEST");
export const sendOrderSuccess = createAction("SEND_ORDER_SUCCESS");
export const sendOrderFailure = createAction("SEND_ORDER_FAILURE");
export const renewAllOrders = createAction("RENEW_ALL_ORDERS");
export const setAllOrders = createAction("SET_ALL_ORDERS"); 
export const clearGetItemSuccess = createAction("CLEAR_GET_ITEM_SUCCESS");

export const sendOrder = order => async (dispatch, getState) => {
  dispatch(sendOrderRequest());
  try {
    const response = await sendOrderNetworkRequest(order);
    dispatch(sendOrderSuccess(response.status));
    return response.data;
  } catch (e) {
    dispatch(sendOrderFailure(e));
  };
};

export const updateOrder = (id, order) => async (dispatch, getState) => {
  dispatch(sendOrderRequest());
  try {
    const response = await updateOrderNetworkRequest(id, order);
    console.log(id)
    console.log(order)
    dispatch(sendOrderSuccess(response.status));
    return response.status;
  } catch (e) {
    dispatch(sendOrderFailure(e));
  };
};
