import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import uuidv4 from 'uuid/v4';
import {
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native';

import {
  updateMessages,
  sendChatToServer,
  sendMessageToServer,
  updateMessagesChatId,
} from '../../../../actions';
import { colors } from '../../../../constants';

class SendMessageBtn extends PureComponent {
  state = {
    queueMessages: [],
    isWaitingForChat: false,
  }

  componentDidUpdate(prevProps) {
    const { chat, sendMessageToServer, updateMessagesChatId } = this.props;
    const { queueMessages } = this.state;

    if (chat._id && !prevProps.chat._id) {
      updateMessagesChatId(chat._id);

      queueMessages.length && queueMessages.map(message =>
        sendMessageToServer(
          this.createSocketMessageObject(message)
        )
      );

      this.setState({ queueMessages: [] });
    }
  }

  render() {
    return (
      <TouchableOpacity onPress={this.sendMessage} style={styles.inputBtn}>
        <Image
          source={require('../../../../../assets/sent-mail.png')}
          style={{ width: 25, height: 25, tintColor:colors.dataColor }}
        />
      </TouchableOpacity>
    );
  }

  sendMessage = () => {
    const { isWaitingForChat } = this.state;
    const {
      chat,
      resetContent,
      updateMessages,
      sendChatToServer,
      sendMessageToServer,
      setShouldScroll,
      //clearVoiceMessage
    } = this.props;
    
    if (!this.validateNewMessageData()) return;

    const newMessage = this.createNewMessage();

    if (!chat._id && isWaitingForChat) {
      this.addMessageToQueue(newMessage);
    }

    if (!chat._id && !isWaitingForChat) {
      sendChatToServer(
        this.createSocketChatObject()
      );
      this.setState({ isWaitingForChat: true });
    }

    chat._id && sendMessageToServer(
      this.createSocketMessageObject(newMessage)
    );

    //clearVoiceMessage();
    setShouldScroll(true);
    updateMessages(newMessage);
    resetContent();
  }

  addMessageToQueue = message => {
    const { queueMessages } = this.state;
    this.setState({ queueMessages: message, ...queueMessages });
  };

  createSocketMessageObject = message => {
    const { chat,userPhone } = this.props;
    
    return {
      chatId: chat._id,
      uuid: message._id,
      mirrorId: chat.mirrorId,
      sender: userPhone,
      content: {
        message: message.content.message && message.content.message,
        attachment: message.content.attachments
      }
    };
  };

  createSocketChatObject = () => {
    const {
      message,
      contactName,
      contactPhone,
      person,
      imageReceiver,
      shop,
      position
    } = this.props;

    return {
      content: {
        message: (message && message).trim(),
        attachment: this.buildAttachment(),
      },
      senderInfo:{
        contactName:person.contactName,
        imageSender: person.thumbnail_url
      },
      receiver: {
        phone: contactPhone,
        contactName,
        imageReceiver,
        position,
        shop:{
          id:shop.id,
          name:shop.name,
          thumbnail_url:shop.thumbnail_url,
          thumbnail_big_url:shop.thumbnail_big_url
        }
      },
    };
  };

  createNewMessage = () => {
    const { userPhone, message, chat } = this.props;

    return {
      _id: uuidv4(),
      sender: userPhone,
      chatId: chat && chat._id ? chat._id : null,
      createdAt: Date.now(),
      content: {
        message: (message && message).trim(),
        attachments: this.buildAttachment(),
      },
    };
  };

  buildAttachment = () => {
    const image = this.attachImage();
    return image 
  };

  attachImage = () => {
    const { image } = this.props;
    return image && { photo: `data:image/jpg;base64,${image.base64}`, inLocal:true };
  };

  validateNewMessageData = () => {
    const { message, image } = this.props;
    //if ((image || message)) return false;

    return message.trim() !== '' || image;
  }
}

const styles = StyleSheet.create({
  inputBtn: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

const mapStateToProps = state => ({
  userPhone: state.auth.phone,
  person: state.auth.person
});

SendMessageBtn.propTypes = {
  chat: PropTypes.object.isRequired,
  message: PropTypes.string,
  resetContent: PropTypes.func.isRequired,
  updateMessages: PropTypes.func.isRequired,
  sendChatToServer: PropTypes.func.isRequired,
  sendMessageToServer: PropTypes.func.isRequired,
  setShouldScroll: PropTypes.func.isRequired,
  image: PropTypes.shape({
    base64: PropTypes.string.isRequired,
  }),
};

export default connect(
  mapStateToProps,
  {
    updateMessages,
    sendChatToServer,
    sendMessageToServer,
    updateMessagesChatId,
  }
)(SendMessageBtn);
