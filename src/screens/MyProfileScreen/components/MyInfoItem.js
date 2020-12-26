import React from "react";
import styled from "styled-components";
import { colors } from "../../../constants";

const Container = styled.View`
  flex-direction: row;
`;

const Value = styled.Text`
  width: 100%;
  padding-left: 5;
  text-align: center;
  font-size: 18;
  color: ${colors.colorSecondary};
`;

export const MyInfoItem = ({ value }) => (
  <Container>
    <Value>{value}</Value>
  </Container>
);

