import { connect } from "react-redux";
import CoopProductDetailScreenComponent from "./CoopProductDetailScreen";

const mapStateToProps = state => ({
  prices: state.prices.prices,
  products: state.priceDetail.coopProducts,
  loading: state.loading.loading,
  numOrdersProducts: state.priceDetail.numOrdersProducts,
});

const mapDispatchToProps = {};

export const CoopProductDetailScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(CoopProductDetailScreenComponent);
