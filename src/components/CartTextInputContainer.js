import { Platform } from "react-native";
import styled from "styled-components";
import { scale } from "react-native-size-matters";
import { colors } from "../constants";

const getPadding = () => {
  return Platform.OS === "ios" ? `${scale(17)}px` : `${scale(10)}px`;
};

export const CartTextInputContainer = styled.View`
  padding: ${getPadding};
  border-width: 1;
  border-radius: 3;
  border-color: ${colors.countInput};
`;
