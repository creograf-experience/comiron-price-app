import { connect } from "react-redux";
import ShopChatListComponent from "./ShopChatListScreen";
import { setActiveChat, fetchChats, flagRerender, clearActiveChat } from "../../actions";


const mapStateToProps = state => ({
  activeChat: state.chats.activeChat,
  user: state.auth.phone,
  chats: state.chats.chatList
});

const mapDispatchToProps = {
  setActiveChat,
  fetchChats,
  flagRerender,
  clearActiveChat
};

export const ShopChatListScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ShopChatListComponent);
