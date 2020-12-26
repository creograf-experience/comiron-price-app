import { Platform } from "react-native";
import styled from "styled-components";
import { verticalScale } from "react-native-size-matters";

import { colors } from "../../../constants";


export const ShopInfoTopWrapper = styled.View`
  flex: 1;
  align-items: center;
  background-color: ${colors.background};
`;

export const ShopInfoBottomWrapper = styled(ShopInfoTopWrapper)`
`;

export const ContactInfoWrapper = styled.View`
  background-color: ${colors.background};
  height: ${Platform.OS == "ios" ? verticalScale(70) : verticalScale(80)};
  flex-direction: row;
`;

