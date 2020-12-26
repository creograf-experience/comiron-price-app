import styled from "styled-components";
import { Platform } from "react-native";
import { moderateScale, scale } from "react-native-size-matters";

import { colors } from "../../constants";

export const TextInputComponent = styled.TextInput`
  font-size: ${moderateScale(16)};
  height: ${scale(37)};
  min-width: ${scale(305)};
  border-bottom-width: ${scale(1)};
  border-bottom-color: ${colors.background};
  color: ${colors.textColorPrimary};
  font-family: ${Platform.OS === "ios" ? "AvenirNext-Regular" : "Roboto"};
`;
