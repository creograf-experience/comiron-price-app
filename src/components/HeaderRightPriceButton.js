import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { BAR_CODE_SCANNER_SCREEN } from "../constants";
export const HeaderRightPriceButton = ({ navigation, stylesIcon }) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(BAR_CODE_SCANNER_SCREEN, {scanned: false})}
    >
      <Image
        source={require("../../assets/qr-code.png")}
        style={stylesIcon}
      />
    </TouchableOpacity>
  );
};
