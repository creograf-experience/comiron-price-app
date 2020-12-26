import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LatestMessage from './LatestMessage';
import LatestMessageDate from './LatestMessageDate';
import { colors } from '../../../constants';
import NotificationMark from '../components/NotificationMark';

const ChatInfo = ({chat,userPhone,shopFlag}) => {
  const fioInLabel = chat.users.find(item =>
    item.phone!==userPhone
  );
  let exetUse = null;
  if(!fioInLabel) {
    exetUse = chat.users.find(item =>
      item.phone==userPhone
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.nameDateRow}>
        <View style={styles.container}>
          <Text style={styles.headerText(shopFlag)}>
            {shopFlag
              ? chat.shop
                ? chat.shop.name 
                  ? chat.shop.name
                  : null 
                : 'Чаты с контактами'  
              : fioInLabel 
                ? fioInLabel.position 
                  ? `${fioInLabel.position} ${fioInLabel.contactName}`
                  : fioInLabel.contactName
                : exetUse
                  ? exetUse.contactName
                  : null
            }
          </Text>
        </View>
        {chat.latestMessage && <LatestMessageDate date={chat.latestMessage.createdAt}/>}
      </View>
      
      <View style={styles.messageNotificationRow}>
        {
          chat.latestMessage
            ? <LatestMessage content={chat.latestMessage.content}/>
            : <Text style={styles.emptyChat}>Нет сообщений</Text>
        }
        {
          chat.notificationCount > 0 && !shopFlag
            ? <NotificationMark count={chat.notificationCount}/>
            : null
        }
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  headerText:(shopFlag)=> ({
    fontSize:14, 
    color:shopFlag ? colors.colorPrimary : 'black', 
    fontWeight:shopFlag ? null : 'bold',
  }),

  nameDateRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },

  messageNotificationRow: {
    flexDirection: 'row'
  },

  emptyChat: {
    fontStyle: 'italic',
    fontSize: 16,
  },
});

export default ChatInfo;