import styled from "styled-components";
import { colors } from "../../constants";
import { scale } from "react-native-size-matters";

const getColor = ({ isViewed }) =>
  isViewed ? colors.textColorPrimary : colors.bgPrice;

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${scale(15)}px;
  background-color: ${getColor};
`;
