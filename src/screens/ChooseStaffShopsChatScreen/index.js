import { connect } from "react-redux";
import ChooseStaffShopsChatComponent from "./ChooseStaffShopsChatScreen";
import {setActiveChat,fetchChats,clearActiveChat, fetchEmployeShops,flagRerender} from '../../actions'


const mapStateToProps = state => ({
  chats: state.chats.chatList,
  activeChat: state.chats.activeChat,
  isSocketConnected: state.socket.isSocketConnected,
  employeList: state.chats.employeList,
  phone: state.auth.phone
});

const mapDispatchToProps = {
  setActiveChat,
  fetchChats,
  clearActiveChat,
  fetchEmployeShops,
  flagRerender
};

export const ChooseStaffShopsChatScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChooseStaffShopsChatComponent);
