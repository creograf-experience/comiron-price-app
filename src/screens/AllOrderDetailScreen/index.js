import { connect } from "react-redux";
import AllOrderDetailScreenComponent from "./AllOrderDetailScreen";
import { clearGetItemSuccess } from "../../actions";
import { orderDetail, itemDetail } from "./actions";
import {
  deleteItemCart,
  addCart,
  showListClick,
  isClickCheck
} from "../PriceDetailScreen/actions";
import { getShopInfo } from "../ShopInfoScreen/actions";

import {
  getCart,
  addItemSite,
  setItemCountSite,
  deleteItemSite,
} from "../../screens/OrderDetailScreen/actions";

import { addCartLength, addCartSZ_Length } from "../MainScreen/actions";

const mapStateToProps = state => ({
  cartSite: state.order.cartSite,
  orderDetailItems: state.order.orderDetailItems,
  singleProduct: state.order.singleProduct,
  loading: state.loading.loading,
  isClick: state.priceDetail.isClick,
  showList: state.priceDetail.showList,
  shop: state.userShopPrices.shop,
  cart: state.priceDetail.cart,
});

const mapDispatchToProps = {
  orderDetail,
  itemDetail,
  clearGetItemSuccess,
  addCart,
  deleteItemCart,
  showListClick,
  isClickCheck,
  getShopInfo,
  getCart,
  addItemSite,
  setItemCountSite,
  deleteItemSite,
  addCartLength,
  addCartSZ_Length,
};

export const AllOrderDetailScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(AllOrderDetailScreenComponent);
