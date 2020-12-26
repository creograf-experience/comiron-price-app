import React from "react";
import { TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { scale } from "react-native-size-matters";

import { TextInputWrapper, TextInputComponent, TextInputErrorText } from "../components";

export const TextInput = ({
  errorText,
  showError,
  placeholder,
  touchable,
  onPress,
  ...otherProps
}) => (
  <TextInputWrapper>
    <TouchableOpacity disabled={!touchable} onPress={onPress}>
      <TextInputComponent
        pointerEvents={touchable ? "none" : "auto"}
        fontSize={scale(15)}
        underlineColorAndroid="transparent"
        placeholder={placeholder}
        placeholderTextColor='white'
        editable={!touchable}
        {...otherProps}
      />
    </TouchableOpacity>

    {
      showError
        ? <TextInputErrorText>{errorText}</TextInputErrorText>
        : null
    }
  </TextInputWrapper>
);

TextInput.propTypes = {
  errorText: PropTypes.string,
  placeholder: PropTypes.string,
  loading: PropTypes.bool,
  showError: PropTypes.bool,
  touchable: PropTypes.bool,
  onPress: PropTypes.func,
};

TextInput.defaultProps = {
  errorText: "Error text",
  placeholder: "Placeholder",
  loading: false,
  showError: false,
  touchable: false,
  onPress: () => {},
};
