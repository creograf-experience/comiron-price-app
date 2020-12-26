import styled from "styled-components";
import { moderateScale } from "react-native-size-matters";

import { colors } from "../constants";

const textSizes = {
  h1: moderateScale(32),
  h2: moderateScale(24),
  h3: moderateScale(18),
  h4: moderateScale(16),
  h5: moderateScale(13),
  h6: moderateScale(10),
};

const chooseSize = ({ size }) => {
  const headerClass = size || "h2";
  return textSizes[headerClass];
};

export const HeaderText = styled.Text`
  font-size: ${chooseSize};
  font-weight: bold;
  color: ${colors.textColorPrimary};
`;

export const PassResHeaderText = styled(HeaderText)`
  textAlign: center;
`;
