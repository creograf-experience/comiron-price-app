import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  View,
  StyleSheet,
} from 'react-native';

import Avatar from './Avatar';
import MessageBox from './MessageBox';
import MessageHistoryDate from './MessageHistoryDate';

import shouldGroupSameDateMsg from '../../../../utils/shouldGroupSameDateMsg';

class MessageListItem extends PureComponent {
  render() {
    const {
      message,
      index,
      messagesList,
      chat,
      user,
    } = this.props;

    const prevMessage = messagesList[index - 1];
    let findReceiver = null;
    if(chat.users){
      findReceiver = chat.users.find(item=>item.phone!=user)
    }else {
      findReceiver = chat.chat.users.find(item=>item.phone!=user)
    }
    return (
      <>
        <MessageHistoryDate
          date={ message.createdAt }
          index={ index }
          messagesList={ messagesList }
        />
        <View style={ styles.container(message.sender, user)}>
          {
            message.sender!== user
              ? shouldGroupSameDateMsg(message, prevMessage)
                  ? <Avatar photo={ null } msg={true} />
                  : <Avatar photo={ findReceiver ? findReceiver.avatar : null} msg={false}/>
              : null
          }
          <MessageBox
            message={ message }
            index={ index }
            messagesList={ messagesList }
          />
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: (msgFrom, user) => ({
    flexDirection: 'row',
    justifyContent: msgFrom === user
      ? 'flex-end'
      : 'flex-start',
    marginHorizontal: 7,
  }),
});

const mapStateToProps = state => ({
  user: state.auth.phone,
});

MessageListItem.propTypes = {
  message: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  messagesList: PropTypes.array.isRequired,
  chat: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(MessageListItem);