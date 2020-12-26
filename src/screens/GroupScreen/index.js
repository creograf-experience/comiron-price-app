import { connect } from "react-redux";

import GroupScreenComponent from "./GroupScreen";

import { 
    addCart,
    deleteItemCart,
    showListClick,
    isClickCheck,
    saveGroup,
    getGroup,
    setProductsToGroup,
    clearProduct,
    renewGroup,
    getNextPage,
  } from "./actions";

  import {
    sendOrder,
    resetSendOrderResponse,
    resetSendOrderError,
  } from "../../actions";

  import {
    getCart,
    addItemSite,
    setItemCountSite,
    deleteItemSite
  } from "../../screens/OrderDetailScreen/actions";

  import { addCartLength } from "../MainScreen/actions";

const mapStateToProps = state => ({
  prices: state.prices.prices,
  loading: state.loading.loading,
  sendOrderResponse: state.order.sendOrderResponse,
  sendOrderError: state.order.sendOrderError,
  groups: state.groups.groups,
  addGroup: state.groups.addGroup,
  products: state.groupDetail.products,
  cart: state.priceDetail.cart,
  isClick: state.priceDetail.isClick,
  showList: state.priceDetail.showList,
  shop: state.userShopPrices.shop,
  totalpages: state.groupDetail.totalpages,
  nextpage: state.groupDetail.nextpage,
});

const mapDispatchToProps = {
  sendOrder,
  resetSendOrderResponse,
  resetSendOrderError,
  addCart,
  deleteItemCart,
  showListClick,
  isClickCheck,
  saveGroup,
  getGroup,
  setProductsToGroup,
  clearProduct,
  getCart,
  addItemSite,
  setItemCountSite,
  deleteItemSite,
  renewGroup,
  getNextPage,
  addCartLength,
};

export const GroupScreen = connect(mapStateToProps, mapDispatchToProps)(GroupScreenComponent);