import { connect } from "react-redux";
import PriceDetailScreenComponent from "./PriceDetailScreen";
import { 
  getPriceProducts,
  setPriceGroups,
  addCart,
  deleteItemCart,
  showListClick,
  isClickCheck,
  postViewPrices,
  getShopProductInfo,
  getPriceGroup,
} from "./actions";
import {
  savePrice,
  setProductsToPrice,
  setNumOrdersProducts,
  sendOrder,
  resetSendOrderResponse,
  resetSendOrderError,
  clearPrice,
} from "../../actions";

import {
  getCart,
  addItemSite,
  setItemCountSite,
  deleteItemSite,
} from "../../screens/OrderDetailScreen/actions";

import { addCartLength } from "../MainScreen/actions";

const mapStateToProps = state => ({
  prices: state.prices.prices,
  products: state.priceDetail.products,
  numOrdersProducts: state.priceDetail.numOrdersProducts,
  loading: state.loading.loading,
  sendOrderResponse: state.order.sendOrderResponse,
  sendOrderError: state.order.sendOrderError,
  groups: state.priceDetail.groups,
  properties: state.priceDetail.properties,
  cart: state.priceDetail.cart,
  isClick: state.priceDetail.isClick,
  showList: state.priceDetail.showList,
});

const mapDispatchToProps = {
  getPriceProducts,
  savePrice,
  setProductsToPrice,
  setNumOrdersProducts,
  sendOrder,
  resetSendOrderResponse,
  resetSendOrderError,
  clearPrice,
  setPriceGroups,
  addCart,
  deleteItemCart,
  showListClick,
  isClickCheck,
  postViewPrices,
  getShopProductInfo,
  getPriceGroup,
  getCart,
  addItemSite,
  setItemCountSite,
  deleteItemSite,
  addCartLength,
};

export const PriceDetailScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(PriceDetailScreenComponent);
