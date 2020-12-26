import { connect } from "react-redux";
import MainChatListComponent from "./MainChatListScreen";
import { fetchChats, setActiveChat,flagRerender, clearActiveChat } from "../../actions";

const mapStateToProps = state => ({
  shopChats: state.chats.shopChatList,
  activeChat: state.chats.activeChat,
  isSocketConnected: state.socket.isSocketConnected,
  user: state.auth.phone,
});

const mapDispatchToProps = {
  fetchChats,
  setActiveChat,
  flagRerender,
  clearActiveChat
};

export const MainChatListScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(MainChatListComponent);
