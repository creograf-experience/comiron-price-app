import { connect } from "react-redux";
import CooperativePurchasesScreenComponent from "./CooperativePurchasesScreen";

import { getCoopPrices } from "./actions";
import {
  getUserProfileRequest,
  getUserProfileSuccess,
  setViewedCoopPrices
} from "../../../actions";

const mapStateToProps = state => ({
  userId: state.auth.userId,
  coopPrices: state.prices.coopPrices,
  viewedPrices: state.prices.viewedCoopPrices,
  loading: state.loading.loading,
  isClick: state.priceDetail.isClick
});

const mapDispatchToProps = {
  getCoopPrices,
  getUserProfileRequest,
  getUserProfileSuccess,
  setViewedCoopPrices,
  // addPrice
};

export const CooperativePurchasesScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(CooperativePurchasesScreenComponent);
