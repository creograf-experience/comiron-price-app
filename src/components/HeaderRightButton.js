import React from "react";
import { StyleSheet, Image, TouchableOpacity, Platform } from "react-native";
import { BAR_CODE_SCANNER_SCREEN } from "../constants";
export const HeaderRightButton = ({ navigation }) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(BAR_CODE_SCANNER_SCREEN, {scanned: false})}
    >
      <Image
        source={require("../../assets/qr-code2.png")}
        style={styles.settings}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  settings: {
    width: 28,
    height: 28,
    marginRight: 25,
    marginBottom: Platform.OS==="ios" ? 5 : 0,
  },
  iosHeaderCenter: {
    height: "100%",
    alignItems: "center",
  },
});
