import { connect } from "react-redux";
import ShopsScreenComponent from "./ShopsScreen";

import {
  getUserShops,
  getAllShops,
  showAllShops,
} from "./actions";

const mapStateToProps = state => ({
  shops: state.userShops.shops,
  fetching: state.userShops.fetching,
  allShops: state.userShops.allShops,
  status: state.userShops.status,
  groups: state.groups.groups,
});

const mapDispatchToProps = dispatch => ({
  getUserShops: userID => {
    dispatch(getUserShops(userID));
  },
  getAllShops: text => {
    dispatch(getAllShops(text));
  },
  showAllShops: () => {
    dispatch(showAllShops());
  },
});

export const ShopsScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ShopsScreenComponent);
