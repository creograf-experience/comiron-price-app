import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import {
  Image,
  View,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';

import Autolink from 'react-native-autolink';

import { deleteMessage } from '../../../../actions';

import { IMAGE_FULL_SCREEN, defaultConfig } from '../../../../constants';

class MessageContent extends PureComponent {
  state = {
    isLoading: false,
  };

  imageWithLoading = () => {
    const { isLoading } = this.state;
    const { message } = this.props;
  
    return (
      <>
        {
          isLoading && <ActivityIndicator
            size="small"
            color="black"
            style={{ position: 'absolute', top: 75, left: 75, right: 75, bottom: 75 }}
          />
        }
        <Image 
          source={{ uri:message.content.attachments.photo }}
          resizeMethod="resize"
          style={{ width: 150, height: 150 }}
          onLoadStart={() => this.setState({ isLoading: true })}
          onLoad={() => this.setState({ isLoading: false })}
        />
      </>
    );
  };

  imageWithShadow = {
    ios: (message, user) => (
      <View style={styles.addShadow}>
        <View style={styles.attachment(message.sender, user)}>
          { this.imageWithLoading() }
        </View>
      </View>
    ),
    android: (message, user) => (
      <View style={[styles.attachment(message.sender, user), styles.addShadow]}>
        { this.imageWithLoading() }
      </View>
    ),
  };

  withText = () => {
    const { message, user } = this.props;

    return (
      <View style={[styles.container(message.sender, user), styles.addShadow]}>
        <Autolink
          style={styles.messageText(message.sender, user)}
          text={message.content.message}
        />
      </View>
    );
  };

  withImageAttachment = () => {
    const { message, navigation, user, deleteMessage } = this.props;

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate(IMAGE_FULL_SCREEN, {
          image: message.content.attachments.photo,
        })}
        onLongPress={() => Alert.alert(
          'Удалить',
          'Вы действительно хотите удалить сообщение?',
          [
            { text: 'Удалить', onPress: () => deleteMessage({ chatId: message.chat, _id: message._id })},
            { text: 'Нет', style: 'cancel' }
          ],
          { cancelable: true }
        )}
        activeOpacity={0.6}
      >
        { this.imageWithShadow[Platform.OS](message, user) }
      </TouchableOpacity>
    );
  };

  withTextAndAttachment = () => {
    const { message, navigation, user } = this.props;

    return (
      <>
        <View style={[styles.container(message.sender, user), styles.addShadow]}>
          <Autolink
            style={[styles.messageText(message.sender, user), { marginBottom: 10 }]}
            text={message.content.message}
          />

          <View>
            <TouchableOpacity
              onPress={() => navigation.navigate(IMAGE_FULL_SCREEN, {
                image: message.content.attachments.photo,
              })}
              activeOpacity={0.6}
            >
              { this.imageWithLoading() }
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  };

  renderAttachment = () => {
    const { content } = this.props.message;

    if (content.attachments && content.attachments.photo) {
      return this.withImageAttachment();
    }
  };

  render() {
    const { message } = this.props;

    return (
      <>
        {
          message.content.message && message.content.attachments
            ? this.withTextAndAttachment()
            : !message.content.attachments
                ? this.withText()
                : !message.content.message
                    ? this.renderAttachment()
                    : null
        }
      </>
    );
  };

}

const styles = StyleSheet.create({
  attachment: (msgFrom, user) => ({
    overflow: 'hidden',
    borderRadius: 15,
    borderTopLeftRadius: msgFrom === user? 15 : 0,
    borderTopRightRadius: msgFrom === user ? 0 : 15,
    backgroundColor: '#f3f3f3',
  }),

  messageText: () => ({
    fontSize: 15,
    color: 'black',
  }),

  container: (msgFrom, user) => ({
    paddingVertical: 10,
    paddingHorizontal: 20,

    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: msgFrom === user ? 20 : 0,
    borderTopRightRadius: msgFrom === user ? 0 : 20,

    backgroundColor:  'white',
  }),

  addShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
});

const mapStateToProps = state => ({
  user:state.auth.phone
});

MessageContent.propTypes = {
  message: PropTypes.object.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, { deleteMessage })(withNavigation(MessageContent));