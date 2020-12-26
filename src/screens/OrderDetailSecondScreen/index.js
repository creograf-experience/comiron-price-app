import { connect } from "react-redux";
import OrderDetailSecondScreenComponent from "./OrderDetailSecondScreen";
import {
  sendOrder,
  resetSendOrderResponse,
  resetSendOrderError,
} from "../../actions";

import { savePhone, saveComment } from "./actions";

import {
  getCart,
  addItemSite,
  deleteItemSite,
  newOrderSend,
  setItemCountSite,
} from "../OrderDetailScreen/actions";

import { deleteItemCart } from "../PriceDetailScreen/actions";

import { addCartLength } from "../MainScreen/actions";

const mapStateToProps = state => ({
  prices: state.prices.prices,
  products: state.priceDetail.products,
  numOrdersProducts: state.priceDetail.numOrdersProducts,
  loading: state.loading.loading,
  sendOrderResponse: state.order.sendOrderResponse,
  sendOrderError: state.order.sendOrderError,
  cartSite: state.order.cartSite,
  phone: state.order.phone,
  savedComment: state.order.comment,
});

const mapDispatchToProps = {
  sendOrder,
  resetSendOrderResponse,
  resetSendOrderError,
  getCart,
  addItemSite,
  deleteItemSite,
  newOrderSend,
  deleteItemCart,
  setItemCountSite,
  addCartLength,
  savePhone,
  saveComment,
};

export const OrderDetailSecondScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderDetailSecondScreenComponent);
