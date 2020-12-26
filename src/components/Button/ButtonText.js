import styled from "styled-components";

import { BodyText } from "../BodyText";
import { colors } from "../../constants";

const getColor = ({ disabled, outlined, color, textColor, fontWeight, fontSize }) => {
  if (disabled) {
    return colors.disabledButtonText;
  }

  if (outlined) {
    return color;
  }

  return textColor;
};

const getFontWeight = ({ fontWeight }) => {
  return fontWeight;
};

const getFontSize = ({ fontSize }) => {
  return fontSize;
};

export const ButtonText = styled(BodyText)`
  font-weight: ${getFontWeight};
  color: ${getColor};
  text-align: center;
  font-size: ${getFontSize};
`;
