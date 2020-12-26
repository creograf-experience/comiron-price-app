import { connect } from "react-redux";
import ShopSearchResultComponent from "./ShopSearchResultScreen";
import { addCart, deleteItemCart,showListClick,isClickCheck } from "../PriceDetailScreen/actions";
import {
  getCart,
  addItemSite,
  setItemCountSite,
  deleteItemSite,
} from "../../screens/OrderDetailScreen/actions";

import { addCartLength } from "../MainScreen/actions";

const mapStateToProps = state => ({
  cart: state.priceDetail.cart,
  isClick: state.priceDetail.isClick,
  showList: state.priceDetail.showList,
});

const mapDispatchToProps = {
  addCart,
  deleteItemCart,
  showListClick,
  isClickCheck,
  getCart,
  addItemSite,
  setItemCountSite,
  deleteItemSite,
  addCartLength,
};

export const ShopSearchResultScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ShopSearchResultComponent);
