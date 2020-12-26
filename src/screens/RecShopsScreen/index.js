import { connect } from "react-redux";
import RecShopsScreenComponent from "./RecShopsScreen";

import { getAllShops, getAllShopsSearch, getUserShops, getAllCityShops } from "./actions";
import { addCartLength } from "../MainScreen/actions";
import { addItemSite } from "../../screens/OrderDetailScreen/actions";

const mapStateToProps = state => ({
  shops: state.shops.shops,
  fetching: state.shops.fetching,
  status: state.shops.status,
  error: state.shops.error,
  shopsSearch: state.shops.shopsSearch,
  userShops: state.shops.userShops,
  cityShops: state.shops.cityShops,
});

const mapDispatchToProps = dispatch => ({
  getAllShops: () => {
    dispatch(getAllShops());
  },
  addCartLength: () => {
    dispatch(addCartLength());
  },
  addItemSite: (id, num, price_id, source, token, refreshToken)  => {
    dispatch(addItemSite(id, num, price_id, source, token, refreshToken));
  },
  getAllShopsSearch: text => {
    dispatch(getAllShopsSearch(text));
  },
  getAllCityShops: city => {
    dispatch(getAllCityShops(city));
  },
  getUserShops: () => {
    dispatch(getUserShops());
  },
});

export const RecShopsScreen = connect(
  mapStateToProps, mapDispatchToProps
)(RecShopsScreenComponent);
