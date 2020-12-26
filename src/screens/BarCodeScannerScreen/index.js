import { connect } from "react-redux";
import BarCodeScannerScreenComponent from "./BarCodeScannerScreen";

const mapStateToProps = state => ({
  isClick: state.priceDetail.isClick,
});

const mapDispatchToProps = {
};

export const BarCodeScannerScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(BarCodeScannerScreenComponent);