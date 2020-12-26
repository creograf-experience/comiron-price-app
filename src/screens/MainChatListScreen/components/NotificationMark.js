import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { colors } from '../../../constants';

const NotificationMark = ({ count }) => (
  <View style={styles.container}>
    <View style={styles.circle}>
      <Text style={styles.count}>{ count }</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginRight: 5,
  },

  circle: {
    flex: 1,
    justifyContent: 'center',

    backgroundColor: colors.colorPrimary,
    width: 28,
    height: 28,
    borderRadius: 14,
  },

  count: {
    color: 'white',
    textAlign: 'center',
  }
});

export default NotificationMark;