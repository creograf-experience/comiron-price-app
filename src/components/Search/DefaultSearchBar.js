import React from "react";
import { SearchBar } from "react-native-elements";

import { colors } from "../../constants";

export const DefaultSearchBar = ({ onEndEditing, onChangeText, onClear, value, placeholderText }) => {
  return (
    <SearchBar
      placeholder={placeholderText}
      returnKeyType="done"
      containerStyle={{
        backgroundColor: colors.textColorPrimary,
        borderTopWidth: 0,
        margin: 0,
        padding: 0,
      }}
      inputContainerStyle={{ backgroundColor: colors.textColorPrimary }}
      lightTheme
      round
      onChangeText={onChangeText}
      onEndEditing={onEndEditing}
      autoCorrect={false}
      onClear={onClear}
      value={value}
    />
  );
};
