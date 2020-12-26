import React from "react";
import { View, Text } from "react-native";

const ClientName = ({ text, textStyle, containerStyle }) => {
  return(
    <View style={[
      containerStyle,
    ]}>
      <Text style={[
        { fontSize: 18 },
        textStyle,
      ]}>
        {text}
      </Text>
    </View>
  );
};

export default ClientName;
