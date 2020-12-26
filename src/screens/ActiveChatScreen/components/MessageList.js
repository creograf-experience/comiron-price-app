import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  ScrollView,
  RefreshControl,
  AsyncStorage
} from 'react-native';

import { Spinner } from "../../../components";
import MessageListItem from './MessageListItem';

import {
  fetchMessages,
  clearMessages,
  clearSkip,
  setMessages,
  flagRerender
} from '../../../actions';
import asyncStorage from '../../../utils/asyncStorage';

class MessageList extends PureComponent {
  state = {
    refreshing: false,
    isLoading: false,
  };

  scrollViewRef = null;

  render() {
    const { refreshing, isLoading } = this.state;
    
    if (isLoading) return <Spinner />;

    return(
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        ref={this.setReference}
        onContentSizeChange={this.handleContetSizeChange}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={this.onRefresh}
          />
        }
        keyboardDismissMode="on-drag"
      >
        { this.renderMessages()}
      </ScrollView>
    )
  }

  async componentDidMount() {
    const { chat, fetchMessages } = this.props;
    if (!chat._id) return;

    const initMessages = async () => {
      this.setState({ isLoading: true });
      const res = await fetchMessages(chat._id);
      await asyncStorage.saveMessages(res, chat._id);
      this.setState({ isLoading: false });
    };
    
    if (chat.notificationCount > 0) {
      await initMessages();
      return;
    }

    //const messages = await asyncStorage.getMessages(`chat-${chat._id}`);
    
    //if (!messages) {
      await initMessages();
      return;
   // }

    this.props.setMessages(messages);
  }

  async componentDidUpdate(prevProps) {  
    const { isSocketConnected, chat, clearMessages, fetchMessages, clearSkip } = this.props;
    
    if (prevProps.isSocketConnected && !isSocketConnected) {
      console.log('SCOKET IS GONE');
      if (!await AsyncStorage.getItem('chat-token')) return;

      this.setState({ isLoading: true });
      clearMessages();
      clearSkip();
      const res = await fetchMessages(chat._id);
      await asyncStorage.saveMessages(res, chat._id);
      this.setState({ isLoading: false });
    };
  }

  renderMessages = () => {
    const { messages, chat } = this.props;
    
    return (
      messages.map((message, index) => (
        <MessageListItem
          key={message._id}
          message={message}
          index={index}
          messagesList={messages}
          chat={chat}
        />
      ))
    );
  }

  setReference = ref => {
    const { setScrollViewRef } = this.props;

    this.scrollViewRef = ref;
    setScrollViewRef(ref);
  }

  onRefresh = async () => {
    const { chat, fetchMessages, setShouldScroll, clearMessages } = this.props;
    if (!chat._id) return;

    setShouldScroll(false);
    
    this.setState({ refreshing: true });
    clearMessages();
    await fetchMessages(chat._id);
    this.setState({ refreshing: false });
  }

  handleContetSizeChange = () => {
    const { shouldScroll } = this.props;
    if (shouldScroll) {
      this.scrollViewRef.scrollToEnd({ animated: false });
    }
  }
}

const mapStateToProps = state => ({
  messages: state.messages.messagesList,
  isSocketConnected: state.socket.isSocketConnected,
  flag: state.chats.flagRerender
});

MessageList.propTypes = {
  messages: PropTypes.array.isRequired,
  chat: PropTypes.object.isRequired,
  setScrollViewRef: PropTypes.func.isRequired,
  shouldScroll: PropTypes.bool.isRequired,
  fetchMessages: PropTypes.func.isRequired,
  clearMessages: PropTypes.func.isRequired,
  clearSkip: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { fetchMessages, clearMessages, clearSkip, setMessages, flagRerender })(MessageList);