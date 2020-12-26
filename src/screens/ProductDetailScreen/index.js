import { connect } from "react-redux";
import ProductDetailScreenComponent from "./ProductDetailScreen";

import { getShopProductInfo } from "./actions";

const mapStateToProps = state => ({
  prices: state.prices.prices,
  products: state.priceDetail.products,
  loading: state.loading.loading,
  numOrdersProducts: state.priceDetail.numOrdersProducts,
  properties: state.productProps.properties,
});

const mapDispatchToProps = { getShopProductInfo };

export const ProductDetailScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductDetailScreenComponent);
