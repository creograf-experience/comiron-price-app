import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { colors } from "../../../constants/colors";

export const NoPrice = ({ text }) => (
  <View style={[ styles.talkBubble, { shadowOffset: {width: 7, height: 0} } ]}>
    <View style={styles.talkBubbleSquare}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <Image
          source={require("../../../../assets/noprice-svg.png")}
          style={{ marginTop: 35, marginLeft: 30, width: 30, height: 35 }}
        />
        <Text style={
          {
            color: colors.backgroundColorSecondary,
            fontSize: 18,
            fontWeight: "bold",
            marginLeft: 15,
            marginRight: 80,
            marginTop: 30,
          }
        }>
          {text}
        </Text>
      </View>
    </View>
    <View style={styles.talkBubbleTriangle} />
  </View>  
);

const styles=StyleSheet.create({
  talkBubble: {
    backgroundColor: "transparent",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowRadius: 7,
    shadowOpacity: 0.5,
    alignItems: "center",
    marginBottom: 40,
  },
  talkBubbleSquare: {
    width: 285,
    height: 120,
    backgroundColor: "white",
    borderRadius: 100,
  },
  talkBubbleTriangle: {
    backgroundColor: "transparent",
    borderBottomWidth: 40,
    borderBottomColor: "white",
    borderLeftWidth: 30,
    borderLeftColor: "transparent",
    borderRightWidth: 10,
    borderRightColor: "transparent",
    position: "absolute",
    top: 105,
    left: 70,
    transform: [
      { rotate: "-150deg" }
    ],
  },
});