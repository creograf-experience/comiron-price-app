import React from "react";
import { TouchableOpacity, Text } from "react-native";
import {Ionicons} from "@expo/vector-icons";

export const IconButton = ({
  name,
  stylesContainer,
  stylesIcon,
  stylesText,
  onPress,
  hitSlop,
  textName
}) => (
  <TouchableOpacity
    style={stylesContainer}
    onPress={onPress}
    hitSlop={hitSlop ? hitSlop : {}}
  >
    <Ionicons name={name} style={stylesIcon}/>
    <Text style={stylesText}>{textName}</Text>
  </TouchableOpacity>
);

IconButton.defaultProps = {
  hitSlop: { top: 30, right: 30, bottom: 0, left: 30 }
};
