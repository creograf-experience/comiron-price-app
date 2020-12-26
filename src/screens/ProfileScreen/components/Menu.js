import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import { colors } from "../../../constants";
import { Ionicons } from "@expo/vector-icons";

export const Menu = ({ value, onPress }) => (
  <TouchableOpacity
    style={styles.settings}
    onPress={onPress}
  >
    <Text style={styles.textStyle}>{value}</Text>
    <Ionicons name={"ios-arrow-forward"} style={styles.arrowStyle}/>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  settings: {
    marginTop: 7,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: colors.textColorPrimary,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 10,
  },
  textStyle: {
    fontSize: 18,
    marginLeft: 20,
  },
  arrowStyle: {
    fontSize: 20,
    marginRight: 30,
    marginBottom: 2,
  },
});