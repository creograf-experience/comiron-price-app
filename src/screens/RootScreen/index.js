import { connect } from "react-redux";
import RootScreenComponent from "./RootScreen";
import { connectSocket } from "../../actions";

const mapStateToProps = state => ({
  isSocketConnected: state.socket.isSocketConnected
});

const mapDispatchToProps = {
  connectSocket
};

export const RootScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(RootScreenComponent);
