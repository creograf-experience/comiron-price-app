import { connect } from "react-redux";

import MyProfileScreenComponent from "./MyProfileScreen";

import {
  getUserProfileRequest,
  getUserProfileSuccess,
  setClients,
  setClientsRequests,
} from "../../actions";

import { logOut, sendPhoto, savePhoto, addPhoto } from "../ProfileScreen/actions";
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
};

export const MyProfileScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(MyProfileScreenComponent);


