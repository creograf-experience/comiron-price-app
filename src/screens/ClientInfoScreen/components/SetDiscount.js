import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from "react-native";

import { colors } from "../../../constants";

import { strings } from "../../../../locale/i18n";

const SetDiscount = ({
  containerStyle,
  textStyle,
  value,
  handleValueChange,
}) => {
  return (
    <View style={[
      { flexDirection: "row", alignItems: "center" },
      containerStyle,
    ]}>
      <Text style={[
        styles.text,
        { marginRight: 10 },
        textStyle,
      ]}>
        {strings("profile.discount")}
      </Text>
      <View style={{ borderBottomWidth: 1 }}>
        <TextInput
          style={{ textAlign: "center" }}
          keyboardType="numeric"
          value={value}
          onChangeText={text => handleValueChange(text)}
        />
      </View>
      <Text styles={ [styles.text, { fontSize: 20 }] }>
        %
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    color: colors.colorSecondary,
  },
});

export default SetDiscount;
