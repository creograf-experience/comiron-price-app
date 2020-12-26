import React from "react";
import PropTypes from "prop-types";
import { ButtonWrapper, Spinner, ButtonText } from "../components";
import { colors } from "../constants";

const colorSets = {
  primary: () => ({
    main: colors.colorPrimary,
    text: colors.textColorPrimary
  }),
  secondary: () => ({
    main: colors.colorSecondary,
    text: colors.textColorPrimary
  }),
  warning: () => ({
    main: colors.colorError,
    text: colors.textColorPrimary
  }),
  custom: (mainColor, textColor) => ({
    main: mainColor,
    text: textColor
  })
};

export const Button = ({
  text,
  onPress,
  loading,
  outlined,
  texted,
  disabled,
  color,
  textColor,
  type,
  halfSize,
  fontWeight,
  fontSize
}) => {
  const colorSet = colorSets[type](color, textColor);

  return (
    <ButtonWrapper
      onPress={onPress}
      outlined={outlined}
      disabled={disabled}
      texted={texted}
      color={colorSet.main}
      loading={loading}
      halfSize={halfSize}
    >
      {
        loading
          ? <Spinner />
          : (
            <ButtonText
              outlined={outlined || texted}
              disabled={disabled}
              color={colorSet.main}
              textColor={colorSet.text}
              fontWeight={fontWeight}
              fontSize={fontSize}
            >
              {text}
            </ButtonText>
          )
      }
    </ButtonWrapper>
  );
};

Button.propTypes = {
  text: PropTypes.string,
  onPress: PropTypes.func,
  loading: PropTypes.bool,
  outlined: PropTypes.bool,
  disabled: PropTypes.bool,
  texted: PropTypes.bool,
  color: PropTypes.string,
  textColor: PropTypes.string,
  type: PropTypes.string,
  fontWeight:PropTypes.string,
  fontSize:PropTypes.string,
};

Button.defaultProps = {
  text: "Text",
  onPress: () => {},
  loading: false,
  outlined: false,
  disabled: false,
  texted: false,
  color: colors.colorPrimary,
  textColor: colors.textColorPrimary,
  type: "primary",
  fontWeight: "bold",
  fontSize: "15",
};
