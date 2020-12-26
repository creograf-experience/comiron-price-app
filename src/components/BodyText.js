import styled from "styled-components";
import { moderateScale } from "react-native-size-matters";

import { colors } from "../constants";

export const BodyText = styled.Text`
  font-size: ${moderateScale(16)};
  color: ${colors.textColorSecondary};
  margin-bottom: ${props => (props.top ? 15 : 0)};
  padding-left: 15;
  padding-right: 15;
`;
