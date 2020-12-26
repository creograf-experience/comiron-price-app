import { handleActions } from "redux-actions";
import {
  sendOrderSuccess,
  sendOrderFailure,
  resetSendOrderResponse,
  resetSendOrderError,
  renewAllOrders,
  setAllOrders,
  clearGetItemSuccess,
  getCartLength,
  getCartSZ_Length,
} from "../actions";
import { getCartSuccess } from "../screens/OrderDetailScreen/actions";
import { getCartSZ_Success } from "../screens/CoopPurchases/CoopOrderDetailScreen/actions";
import { getOrderSuccess, getItemSuccess } from "../screens/AllOrderDetailScreen/actions";
import { savePhoneSuccess, saveCommentSuccess } from "../screens/OrderDetailSecondScreen/actions";

const initialState = {
  sendOrderResponse: "",
  sendOrderError: "",
  cartSite: [],
  cartSZ_Site: [],
  order: [],
  orderDetailItems: [],
  singleProduct: [],
  cartLength: 0,
  cartSZ_Length: 0,
  phone: "",
  comment: [],
};

export const order = handleActions(
  {
    [getCartLength](state, { payload }) {
      return { ...state, cartLength: payload };
    },
    [getCartSZ_Length](state, { payload }) {
      return { ...state, cartSZ_Length: payload };
    },
    [sendOrderSuccess](state, { payload }) {
      return { ...state, sendOrderResponse: payload };
    },
    [sendOrderFailure](state, { payload }) {
      return { ...state, sendOrderError: payload };
    },
    [resetSendOrderResponse](state, {}) {
      return { ...state, sendOrderResponse: "" };
    },
    [resetSendOrderError](state, {}) {
      return { ...state, sendOrderError: "" };
    },
    [getCartSuccess](state, { payload }) {
      return { ...state, cartSite: payload.product }
    },
    [getCartSZ_Success](state, { payload }) {
      return { ...state, cartSZ_Site: payload.product }
    },
    [setAllOrders](state, { payload }) {
      const payloadFilter = payload.orders.map(order => order.id);
      const pricesFiltered = state.order.filter(order => !payloadFilter.includes(String(order.id)));

      return { ...state, order: pricesFiltered.concat(payload.orders) };
    },
    [renewAllOrders](state, { payload }) {
      return { ...state, order: payload.orders };
    },
    [getOrderSuccess](state, { payload }) {
      return {...state, orderDetailItems: payload.items}
    },
    [getItemSuccess](state, { payload }) {
      return {...state, singleProduct: state.singleProduct.concat(payload.singleProduct)}
    },
    [clearGetItemSuccess](state, {}) {
      return { ...state, singleProduct: [] };
    },
    [savePhoneSuccess](state, { payload }) {
      return {...state, phone: payload};
    },
    [saveCommentSuccess](state, { payload }) {
      return {...state, comment: state.comment.concat(payload.comment)};
    },
  },
  initialState
);
