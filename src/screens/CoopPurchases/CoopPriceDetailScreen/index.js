import { connect } from "react-redux";
import CoopPriceDetailScreenComponent from "./CoopPriceDetailScreen";
import {
  getCoopPriceProducts,
  addItemSZ_Site,
  setItemSZ_CountSite,
  deleteItemSZ_Site,
} from "./actions";
import {
  saveCoopPrice,
  setProductsToCoopPrice,
  setNumOrdersProducts,
  sendOrder,
  resetSendOrderResponse,
  resetSendOrderError,
  clearCoopPrice,
} from "../../../actions";
import { showListClick, isClickCheck } from "../../PriceDetailScreen/actions";
import { addCartSZ_Length } from "../../MainScreen/actions";

const mapStateToProps = state => ({
  prices: state.prices.prices,
  products: state.priceDetail.coopProducts,
  numOrdersProducts: state.priceDetail.numOrdersProducts,
  loading: state.loading.loading,
  sendOrderResponse: state.order.sendOrderResponse,
  sendOrderError: state.order.sendOrderError,
  coopGroups: state.priceDetail.coopGroups,
  isClick: state.priceDetail.isClick,
  showList: state.priceDetail.showList,
});

const mapDispatchToProps = {
  getCoopPriceProducts,
  saveCoopPrice,
  setProductsToCoopPrice,
  setNumOrdersProducts,
  sendOrder,
  resetSendOrderResponse,
  resetSendOrderError,
  clearCoopPrice,
  showListClick,
  isClickCheck,
  addItemSZ_Site,
  setItemSZ_CountSite,
  deleteItemSZ_Site,
  addCartSZ_Length,
};

export const CoopPriceDetailScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(CoopPriceDetailScreenComponent);
