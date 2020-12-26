import { connect } from "react-redux";
import ActiveChatComponent from "./ActiveChatScreen";
import {
  clearSkip,
  clearMessages,
  clearActiveChat,
  clearNotification,
  activeChatWithDefaulValue,
} from '../../actions';


const mapStateToProps = state => ({
  activeChat: activeChatWithDefaulValue(state)
});

const mapDispatchToProps = {
  clearMessages,
  clearActiveChat,
  clearNotification,
  clearSkip,
};

export const ActiveChatScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ActiveChatComponent);