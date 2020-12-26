import { connect } from "react-redux";
import OrderDetailScreenComponent from "./OrderDetailScreen";
import {
  sendOrder,
  resetSendOrderResponse,
  resetSendOrderError,
} from "../../actions";

import {
  getCart,
  addItemSite,
  deleteItemSite,
  newOrderSend,
  setItemCountSite,
} from "./actions";

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
};

export const OrderDetailScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderDetailScreenComponent);
