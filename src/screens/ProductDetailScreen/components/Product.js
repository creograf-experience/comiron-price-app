import styled from "styled-components";
import { colors } from "../../../constants";

export const Product = styled.View`
  position: relative;
  width: 100%;
  flex-direction: row;
  align-items: center;
  border-top-width: 1;
  border-bottom-width: 1;
  border-color: ${colors.background};
`;
