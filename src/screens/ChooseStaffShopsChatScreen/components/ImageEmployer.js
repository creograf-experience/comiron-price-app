import React from 'react';
import {
  Image,
  StyleSheet,
} from 'react-native';
import notAvailable from "../../../../assets/not-available.png";
import {hostImages} from "../../../constants";

const ImageEmployer = ({image}) => {
  
  return (
    <Image
      style={{
        height:56,
        width:56,
        borderRadius:25,
        marginRight:10
      }}
      source={image ? {uri: `${hostImages}${image}`} : notAvailable}
    />
  )
};

const styles = StyleSheet.create({
 
});

export default ImageEmployer;