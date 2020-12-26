import styled from "styled-components";
import { Platform } from "react-native";

export const Name = styled.Text`
  font-size: 16;
  font-weight: 700;
  margin-bottom: 5;
  margin-top: ${Platform.OS === "android" ? 0 : 5};
  flex: 1;
`;
