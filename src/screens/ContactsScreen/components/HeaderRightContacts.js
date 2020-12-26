import React from "react";
import { StyleSheet, Image, TouchableOpacity, Platform } from "react-native";
import { CONTACTS_SCREEN, colors } from "../../../constants";

export const HeaderRightContacts = ({ navigation }) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(CONTACTS_SCREEN)}
    >
      <Image
        source={require("../../../../assets/plus.png")}
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
    tintColor: colors.textColorPrimary
  },
  iosHeaderCenter: {
    height: "100%",
    alignItems: "center",
  },
});
