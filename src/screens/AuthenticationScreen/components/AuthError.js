import styled from "styled-components";
import { scale } from "react-native-size-matters";

import { colors } from "../../../constants";

export const AuthError = styled.Text`
  font-size: ${scale(16)}px;
  background-color: ${colors.backgroundColorSecondary};
  color: ${colors.textColorPrimary};
  padding: ${scale(10)}px ${scale(20)}px;
`;
