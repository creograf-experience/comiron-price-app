import { connect } from "react-redux";
import ProfileScreenComponent from "./ProfileScreen";

import {
  getUserProfileRequest,
  getUserProfileSuccess,
  setClients,
  setClientsRequests,
  disconnectSocket
} from "../../actions";
import { logOut, sendPhoto, savePhoto, addPhoto } from "./actions";
import { logIn } from "../AuthenticationScreen/actions";

const mapStateToProps = state => ({
  loading: state.loading.loading,
  phonePhoto: state.profile.phonePhoto,
  clientsRequests: state.clients.clientsRequests,
});

const mapDispatchToProps = {
  getUserProfileRequest,
  getUserProfileSuccess,
  logOut,
  sendPhoto,
  savePhoto,
  logIn,
  addPhoto,
  setClients,
  setClientsRequests,
  disconnectSocket
};

export const ProfileScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileScreenComponent);
