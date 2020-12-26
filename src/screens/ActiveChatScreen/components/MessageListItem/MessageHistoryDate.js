import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';

import { whatDayItIs, format } from '../../../../utils/whatDayItIs';

const MessageHistoryDate = ({ date, index, messagesList }) => (
  <>
    { renderMessageHistoryDate(date, index, messagesList) }
  </>
);

const styles = StyleSheet.create({
  messageBlockDate: {
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 30,
  },

  firstMessageBlockDate: {
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 15,
  },

  date: {
    color: '#a4a4a4',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

MessageHistoryDate.propTypes = {
  date: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  index: PropTypes.number.isRequired,
  messagesList: PropTypes.array.isRequired,
};

export default MessageHistoryDate;

const renderMessageHistoryDate = (date, index, messagesList) => {
  const msgDate = {
    fullDate: date,
    day: new Date(date).getUTCDate(),
    month: new Date(date).getUTCMonth(),
    year: new Date(date).getUTCFullYear(),
  };

  if (index === 0) {
    return (
      <View style={styles.firstMessageBlockDate}>
        <Text style={styles.date}>{ whatDayItIs(msgDate, format('Today')) }</Text>
      </View>
    );
  }

  const prevMsg = messagesList[index - 1];
  const prevDate = {
    day: new Date(prevMsg.createdAt).getUTCDate(),
    month: new Date(prevMsg.createdAt).getUTCMonth(),
    year: new Date(prevMsg.createdAt).getUTCFullYear(),
  };

  if (
    msgDate.day !== prevDate.day ||
    msgDate.month !== prevDate.month ||
    msgDate.year !== prevDate.year
  ) {
    return (
      <View style={styles.messageBlockDate}>
        <Text style={styles.date}>{ whatDayItIs(msgDate, format('Today')) }</Text>
      </View>
    );
  }
};