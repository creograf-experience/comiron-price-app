import React from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  StyleSheet,
  View,
} from 'react-native';
import {hostImages} from "../../../../constants";
import notAvailable from "../../../../../assets/not-available.png";
const Avatar = ({ photo, msg }) => (
  <View>
    <Image
      source={ msg 
        ? null
        : photo 
          ? {uri: `${hostImages}${photo}`} 
          : notAvailable
       }
      style={styles.avatar}
      resizeMethod="resize"
    />
  </View>
);

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 5,
  },
});

Avatar.propTypes = {
  photo: PropTypes.string,
};

export default Avatar;
