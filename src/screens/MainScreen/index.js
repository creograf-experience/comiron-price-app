import { connect } from "react-redux";
import MainScreenComponent from "./MainScreen";

import {
  getPrices,
  addPrice,
  renewPriceList,
  addCartLength,
  addCartSZ_Length,
} from "./actions";
import {
  getUserProfileRequest,
  getUserProfileSuccess,
  setViewedPrices,
} from "../../actions";

const mapStateToProps = state => ({
  userId: state.auth.userId,
  prices: state.prices.prices,
  viewedPrices: state.prices.viewedPrices,
  loading: state.loading.loading,
  isClick: state.priceDetail.isClick,
});

const mapDispatchToProps = {
  getPrices,
  getUserProfileRequest,
  getUserProfileSuccess,
  setViewedPrices,
  addPrice,
  renewPriceList,
  addCartLength,
  addCartSZ_Length,
};

export const MainScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(MainScreenComponent);
