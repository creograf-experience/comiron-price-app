import { connect } from "react-redux";
import ContactsComponent from "./ContactsScreen";
import {setActiveChat, fetchChats, clearActiveChat,fetchContacts} from '../../actions'


const mapStateToProps = state => ({
  contactList: state.contacts.contactList,
  chats: state.chats.chatList,
  activeChat: state.chats.activeChat,
  isSocketConnected: state.socket.isSocketConnected,
});

const mapDispatchToProps = {
  setActiveChat,
  fetchChats,
  clearActiveChat,
  fetchContacts
};

export const ContactsScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactsComponent);
