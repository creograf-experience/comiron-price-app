import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { whatDayItIs, format } from "../../../utils";

const LatestMessageDate = ({ date }) => {
  const msgDate = {
    fullDate: date,
    day: new Date(date).getUTCDate(),
    month: new Date(date).getUTCMonth(),
    year: new Date(date).getUTCFullYear(),
  };

  return (
    <View style={styles.latestMessageDate}>
      <Text>
        { whatDayItIs(msgDate, format('hh:mm')) }
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  latestMessageDate: {
    marginLeft:5
  },
});


export default LatestMessageDate;
