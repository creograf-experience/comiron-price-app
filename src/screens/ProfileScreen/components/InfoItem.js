import React from "react";
import styled from "styled-components";
import { colors } from "../../../constants";

const Value = styled.Text`
  margin-left: 20;
  margin-top: 40;
  font-size: 18;
  color: ${colors.colorSecondary};
`;

export const InfoItem = ({ value }) => (
  <Value>{value}</Value>
);

