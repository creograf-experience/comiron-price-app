import React from "react";
import { Text, Platform, StyleSheet } from "react-native";
import { colors } from "../constants";

export const DefaultHeader = () => (
  <Text
    style={
      Platform.OS === "ios"
        ? [styles.headerTitle, styles.iosHeaderCenter]
        : styles.headerTitle
    }
  >
    <Text style={styles.comiron}>COMIRON</Text>

    <Text style={styles.com}>.COM</Text>
  </Text>
);

const styles = StyleSheet.create({
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontFamily: "carlito-bold",
    fontSize: 20,
  },
  comiron: {
    fontSize: 30,
    color: colors.textColorPrimary,
  },
  com: {
    color: colors.colorPrimary,
  },
  iosHeaderCenter: {
    height: "100%",
    alignItems: "center",
  },
});
