import { connect } from "react-redux";
import AllOrderScreenComponent from "./AllOrderScreen";
import { renewGetAllOrder, getAllOrder } from "./actions";

const mapStateToProps = state => ({
  loading: state.loading.loading,
  order: state.order.order,
  isClick: state.priceDetail.isClick,
});

const mapDispatchToProps = {
  renewGetAllOrder,
  getAllOrder,
};

export const AllOrderScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(AllOrderScreenComponent);
