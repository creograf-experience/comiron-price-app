import styled from "styled-components";
import { colors } from "../constants";

export const CommentTextInputContainer = styled.View`
  padding-left: 5;
  padding-right: 10;
  padding-bottom: 25;
  background-color: ${colors.textColorPrimary};
  border-width: 1;
  border-radius: 3;
  margin-left: 10;
  margin-right: 10;
  margin-bottom: 5;
  border-color: ${colors.dataColor};
`;

export const PhoneInputContainer = styled(CommentTextInputContainer)`
  padding-bottom: 0;
  margin-left: 5;
  margin-bottom: 0;
  width: 42%;
`;