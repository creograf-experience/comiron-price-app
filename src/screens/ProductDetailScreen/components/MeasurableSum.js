import React from "react";
import styled from "styled-components";
import { strings } from '../../../../locale/i18n';
const Price = styled.Text`
  font-weight: bold;
`;

const Sum = styled.Text``;

export const MeasurableSum = ({ sum }) => (
  <Price>
    {strings('productDetail.cost')}
    <Sum> {sum}</Sum> ₽
  </Price>
);
