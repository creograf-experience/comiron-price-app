import styled from "styled-components";
import { scale } from "react-native-size-matters";

import { colors } from "../../constants";

const getBackgroundColors = ({ outlined, texted, disabled, color }) => {
  if (disabled && !outlined && !texted) {
    return colors.disabledButtonBackground;
  }

  if (outlined || texted) {
    return colors.transparent;
  }

  return color;
};

export const ButtonWrapper = styled.TouchableOpacity`
  ${({ texted }) => (texted ? "" : `padding-horizontal: ${scale(10)};`)}
  background-color: ${getBackgroundColors};
  border-width: ${({ outlined }) => (outlined ? scale(1) : 0)}
  border-color: ${({ outlined }) =>
    outlined ? colors.inStockColor : colors.transparent};
  min-width: ${({ loading }) => (loading ? scale(128) : scale(64))};
  ${({ texted }) => (texted ? "" : `height: ${scale(50)};`)}
  justify-content: center;
  elevation: ${({ texted, outlined }) => (texted || outlined ? 0 : 2)};
  width: ${({ halfSize }) => (halfSize ? "50%" : "auto")};
  margin-top: ${({ texted }) => (texted ? scale(18) : 0)};
`;
