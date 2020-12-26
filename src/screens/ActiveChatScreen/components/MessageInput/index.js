import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  View,
  TextInput,
  StyleSheet,
  Platform
} from 'react-native';

import Attachment from './Attachment';
import SelectPhotoBtn from './SelectPhotoBtn';
import SendMessageBtn from './SendMessageBtn';

class MessageInput extends PureComponent {
  state = {
    message: '',
    image: null
  };

  placeholders = {
    default: 'Сообщение...',
  };

  render() {
    const {
      message,
      image
    } = this.state;
    const {
      chat,
      contactName,
      contactPhone,
      imageReceiver,
      setShouldScroll,
      shop,
      position
    } = this.props;

    return (
      <View style={styles.bg}>

        {
          image
            ? (
              <Attachment
                image={image}
                resetAttachment={this.resetAttachment}
              />
            )
            : null
        }

        <View style={styles.container}>
          {
            <View style={{ width: '15%' }}>
              <SelectPhotoBtn
                setAttachment={this.setAttachment}
              />
            </View>
          }

          {
            <TextInput
              style={styles.input}
              placeholder={
                this.placeholders.default
              }
              multiline
              value={message}
              onChangeText={text => this.setState({ message: text })}
              ref={ref => { 
                this.textInputRef = ref;
                this.props.setTextInputRef(ref);
              }}
            />
          }

          <View style={{ width: '15%' }}>
            {
              <SendMessageBtn
                contactName={contactName}
                contactPhone={contactPhone}
                imageReceiver={imageReceiver}
                shop={shop}
                chat={chat}
                message={message}
                image={image}
                position={position}
                resetContent={this.resetContent}
                setShouldScroll={setShouldScroll}
              />
            }
          </View>

        </View>
      </View>
    );
  }

  resetAttachment = () => this.setState({ image: null });
  resetContent = () => this.setState({ message: '', image: null });
  setAttachment = image => this.setState({ image });
}

const styles = StyleSheet.create({
  bg: {
    backgroundColor: 'white'
  },

  container: {
    flexDirection: 'row',
  },

  input: {
    flex: 1,

    paddingTop: Platform.OS === 'android' ? 10 : 15,
    paddingBottom: Platform.OS === 'android' ? 10 : 15,
    paddingLeft: 5,
    paddingRight: 5,

    fontSize: 15,
  },
});

MessageInput.propTypes = {
  chat: PropTypes.object.isRequired,
  setShouldScroll: PropTypes.func.isRequired,
  contactName: PropTypes.string,
  contactPhone: PropTypes.string,
  recording: PropTypes.string,
  isVoiceMessageLoading: PropTypes.bool,
};

const mapStateToProps = state => ({

});

export default connect(mapStateToProps, {})(MessageInput);