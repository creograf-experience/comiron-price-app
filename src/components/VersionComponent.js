import React from "react";

import { Text, StyleSheet } from "react-native";

import Constants from "expo-constants";

import { strings } from "../../locale/i18n";

const appVersion = Constants.manifest.version;

export const VersionComponent = () => {
  return (
    <Text style={styles.versionStyle}>{strings("profile.version")} {appVersion}</Text>
  );
}

const styles = StyleSheet.create({
  versionStyle: {
    fontSize: 12,
    alignSelf: "flex-end",
    marginRight: 5,
  },
});