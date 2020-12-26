import { connect } from "react-redux";
import AuthenticationScreenComponent from "./AuthenticationScreen";
import { logIn, checkProfile } from "./actions";
import { getUserTokenRequest, getUserTokenSuccess, connectSocket } from "../../actions";

const mapStateToProps = state => ({
  token: state.auth.accessToken,
  authError: state.auth.error,
  loading: state.loading.loading,
  checkId: state.auth.checkId,
  phone: state.auth.phone
});

const mapDispatchToProps = {
  getUserTokenRequest,
  getUserTokenSuccess,
  logIn,
  checkProfile,
  connectSocket
};

export const AuthenticationScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthenticationScreenComponent);
