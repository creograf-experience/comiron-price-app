import React from "react";
import styled from "styled-components";
import { StyleSheet } from "react-native";

import { colors } from "../constants";
import { strings } from "../../locale/i18n";

const CircleOn = styled.View`
  width: 10;
  height: 10;
  border-radius: 5;
  background-color: ${colors.colorPrimary};
`;

const CircleOff = styled.View`
  width: 10;
  height: 10;
  border-radius: 5;
  background-color: ${colors.dataColor};
  opacity: 0.5;
`;

const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
  padding-top: 7;
`;

const InStockContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 40;
`;

const JustText = styled.Text`
  color: ${colors.dataColor};
  padding-top: 5;
`;

export const InStock = ({ value, unit }) => {
  if (value > 1000) {
    return (
      <Wrapper>
        <InStockContainer>
          <CircleOn/>
          <CircleOn/>
          <CircleOn/>
        </InStockContainer>
      </Wrapper>
    );
  }

  if (value > 100) {
    return (
      <Wrapper>
        <InStockContainer>
          <CircleOn/>
          <CircleOn/>
          <CircleOff/>
        </InStockContainer>
      </Wrapper>
    );
  }

  if (value > 10) {
    return (
      <Wrapper>
        <InStockContainer>
          <CircleOn/>
          <CircleOff/>
          <CircleOff/>
        </InStockContainer>
      </Wrapper>
    );
  }

  if (value > 0 && value < 10) {
    return <JustText>{`${value} ${unit}`}</JustText>;
  }

  return <JustText>{strings("componentInStock.valueNone")}</JustText>;
};
