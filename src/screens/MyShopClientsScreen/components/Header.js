import React from "react";
import { View, Text } from "react-native";

const Header = ({ text, textStyle, containerStyle }) => {
  return(
    <View style={[
      { marginHorizontal: 35, marginVertical: 10 },
      containerStyle
    ]}>
      <Text style={[
        { fontSize: 18, fontWeight: "600" },
        textStyle
      ]}>
        {text}
      </Text>
    </View>
  );
};

export default Header;
