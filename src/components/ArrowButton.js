import React from "react";
import { StyleSheet, Image, TouchableOpacity, View } from "react-native";
import { colors } from "../constants/";

export const ArrowButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
    >
      <View style={styles.wrapper}>
        <Image
          source={require("../../assets/download-arrow.png")}
          style={styles.settings}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  settings: {
    width: 18,
    height: 13,

  },
  wrapper: {
    width: 60,
    height: 60,
    backgroundColor: colors.colorPrimary,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});

