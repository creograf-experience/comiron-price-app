import { createAction } from "redux-actions";
import {
  OrderSZ_NetworkRequest,
  getCartSZ_SiteNetworkRequest,
} from "../../../networkers";

export const getCartSZ_Request = createAction("GET_CART_SZ_REQUEST");
export const getCartSZ_Success = createAction("GET_CART_SZ_SUCCESS");
export const getCartSZ_Failure = createAction("GET_CART_SZ_FAILURE");

export const addItemSZ_SiteRequest = createAction("ADD_ITEM_SZ_SITE_REQUEST");
export const addItemSZ_SiteSuccess = createAction("ADD_ITEM_SZ_SITE_SUCCESS");
export const addItemSZ_SiteFailure = createAction("ADD_ITEM_SZ_SITE_FAILURE");

export const setItemSZ_CountSiteRequest = createAction("SET_ITEM_SZ_COUNT_SITE_REQUEST");
export const setItemSZ_CountSiteSuccess = createAction("SET_ITEM_SZ_COUNT_SITE_SUCCESS");
export const setItemSZ_CountSiteFailure = createAction("SET_ITEM_SZ_COUNT_SITE_FAILURE");

export const deleteItemSZ_SiteRequest = createAction("DELETE_ITEM_SZ_SITE_REQUEST");
export const deleteItemSZ_SiteSuccess = createAction("DELETE_ITEM_SZ_SITE_SUCCESS");
export const deleteItemSZ_SiteFailure = createAction("DELETE_ITEM_SZ_SITE_FAILURE");

export const newOrderSZ_Request = createAction("NEW_ORDER_SZ_REQUEST");
export const newOrderSZ_Success = createAction("NEW_ORDER_SZ_SUCCESS");
export const newOrderSZ_Failure = createAction("NEW_ORDER_SZ_FAILURE");

export const getCart_SZ = (shop_id, price_id, token, refreshToken) => async (dispatch) => {
  dispatch(getCartSZ_Request());
  try {
    const response = await getCartSZ_SiteNetworkRequest(shop_id, price_id, token, refreshToken);
    const cart = response.cart;
    const product = cart.map(el => {
      return {
        ...el.product,
        cartCount: +el.product.razmerme ? `${(+el.num).toFixed(1)}` : `${(+el.num).toFixed(0)}`,
        numberProductId: el.id,
        price_id: el.price_id,
      }
    });
    dispatch(getCartSZ_Success({ product }));
  } catch (e) {
    dispatch(getCartSZ_Failure());
  };
};

export const OrderSZ_Send = (order, token, refreshToken) => async (dispatch) => {
  dispatch(newOrderSZ_Request());
  try {
    const response = await OrderSZ_NetworkRequest(order, token, refreshToken);
    dispatch(newOrderSZ_Success());
  } catch(e) {
    dispatch(newOrderSZ_Failure());
  };
};