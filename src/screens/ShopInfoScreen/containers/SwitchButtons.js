import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { colors } from "../../../constants";

export const SwitchButtons = ({ onPressGroup, onPressPrice, groupFlag, priceFlag }) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={onPressGroup} style={[ styles.btnLayout, groupFlag ? styles.current : null ]}>
      <Image
        style={{
          height: 30,
          width: 30,
          tintColor: groupFlag ? colors.colorPrimary : colors.dataColor,
          resizeMode: "contain",
        }}
        source={require("../../../../assets/inbox.png")}
      />
    </TouchableOpacity>
    <TouchableOpacity onPress={onPressPrice} style={[ styles.btnLayout, priceFlag ? styles.current : null ]}>
      <Image
        style={{
          height: 30,
          width: 30,
          tintColor: priceFlag ? colors.colorPrimary : colors.dataColor,
          resizeMode: "contain",
        }}
        source={require("../../../../assets/pricelist-svg.png")}
      />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  btnLayout: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 7,
    paddingBottom: 7,
  },
  current: {
    borderBottomWidth: 3,
    borderColor: colors.colorPrimary,
  },
  container: {
    flexDirection: "row",
    width: "90%",
    alignSelf: "center",
  },
});