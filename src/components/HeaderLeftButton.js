import React from "react";
import { StyleSheet, Image, TouchableOpacity, Platform } from "react-native";
import { CONTACT_SCREEN } from "../constants";
export const HeaderLeftButton = ({ navigation, isBackgroundWhite }) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(CONTACT_SCREEN)}
    >
      <Image
        source={isBackgroundWhite ? require("../../assets/question-mark.png") : require("../../assets/info-button.png")}
        style={styles.settings}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  settings: {
    tintColor: "white",
    width: 35,
    height: 35,
    marginLeft: 25,
    marginBottom: Platform.OS === "ios" ? 5 : 0
  },
  iosHeaderCenter: {
    height: "100%",
    alignItems: "center",

  },
});
