import { createAction } from "redux-actions";
import { getOrderDetailNetworkRequest,getItemNetworkRequest } from "../../networkers";

export const getOrderRequest = createAction("GET_ORDER_REQUEST");
export const getOrderSuccess = createAction("GET_ORDER_SUCCESS");
export const getOrderFailure = createAction("GET_ORDER_FAILURE");

export const getItemRequest = createAction("GET_ITEM_REQUEST");
export const getItemSuccess = createAction("GET_ITEM_SUCCESS");
export const getItemFailure = createAction("GET_ITEM_FAILURE");


export const orderDetail = (token, refreshToken, numberOrder) => async (dispatch) => {
  dispatch(getOrderRequest());
  try {
    const response = await getOrderDetailNetworkRequest(token, refreshToken, numberOrder);
    const items = response.order.details;
    dispatch(getOrderSuccess({ items }));
  } catch(e) {
    dispatch(getOrderFailure());
  }
};
 
export const itemDetail = (token, refreshToken, productId) => async (dispatch) => {
  dispatch(getItemRequest());
    try {
      const response = await getItemNetworkRequest(token, refreshToken, productId);
      const singleProduct = response.product;
      dispatch(getItemSuccess({ singleProduct }));
      
    } catch(e) {
      dispatch(getItemFailure());
    }
};