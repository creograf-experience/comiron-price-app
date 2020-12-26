import { connect } from "react-redux";
import CoopOrderDetailScreenComponent from "./CoopOrderDetailScreen";
import {
  sendOrder,
  updateOrder,
  resetSendOrderResponse,
  resetSendOrderError,
} from "../../../actions";

import { getCart_SZ, OrderSZ_Send } from "./actions";

import { setItemSZ_CountSite, deleteItemSZ_Site } from "../CoopPriceDetailScreen/actions";

import { newOrderSend } from "../../OrderDetailScreen/actions";

import { addCartSZ_Length } from "../../MainScreen/actions";

const mapStateToProps = state => ({
  prices: state.prices.prices,
  products: state.priceDetail.coopProducts,
  numOrdersProducts: state.priceDetail.numOrdersProducts,
  loading: state.loading.loading,
  sendOrderResponse: state.order.sendOrderResponse,
  sendOrderError: state.order.sendOrderError,
  cartSZ_Site: state.order.cartSZ_Site,
});

const mapDispatchToProps = {
  sendOrder,
  updateOrder,
  resetSendOrderResponse,
  resetSendOrderError,
  getCart_SZ,
  setItemSZ_CountSite,
  deleteItemSZ_Site,
  OrderSZ_Send,
  newOrderSend,
  addCartSZ_Length,
};

export const CoopOrderDetailScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(CoopOrderDetailScreenComponent);
