import { connect } from "react-redux";
import RegisterScreenComponent from "./RegisterScreen";

import { register } from "./actions";

const mapStateToProps = state => ({
  loading: state.loading.loading,
});

const mapDispatchToProps = {
  register,
};

export const RegisterScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterScreenComponent);
