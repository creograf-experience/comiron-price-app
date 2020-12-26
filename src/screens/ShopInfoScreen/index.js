import { connect } from "react-redux";
import ShopInfoScreenComponent from "./ShopInfoScreen";

import {
  getShopPrices,
  getShopInfo,
  addClient,
  deleteShop,
  callManager,
  clearGroups,
  renewShopList,
} from "./actions";

import {
  addPrice
} from "../MainScreen/actions";

const mapStateToProps = state => ({
  prices: state.userShopPrices.prices,
  shop: state.userShopPrices.shop,
  fetching: state.userShopPrices.fetching,
  status: state.userShopPrices.status,
  isClick: state.priceDetail.isClick,
  allPrices: state.prices.prices,
  groups: state.groups.groups,
});

const mapDispatchToProps = dispatch => ({
  getShopPrices: (shopID, i, userID) => {
    dispatch(getShopPrices(shopID, i, userID));
  },
  getShopInfo: shopID => {
    dispatch(getShopInfo(shopID));
  },
  addClient: (shopID, token, refreshToken) => {
    dispatch(addClient(shopID, token, refreshToken));
  },
  deleteShop: (shopID, token, refreshToken) => {
    dispatch(deleteShop(shopID, token, refreshToken));
  },
  callManager: (person)=>{
    dispatch(callManager(person));
  },
  addPrice:(price)=>{
    dispatch(addPrice(price));
  },
  clearGroups: () => {
    dispatch(clearGroups());
  },
  renewShopList: shopID => {
    dispatch(renewShopList(shopID));
  },
});

export const ShopInfoScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ShopInfoScreenComponent);
