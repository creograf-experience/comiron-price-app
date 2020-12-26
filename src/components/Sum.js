import React from "react";
import styled from "styled-components";

import { Button } from "../containers";
import { colors } from "../constants";
import { strings } from "../../locale/i18n";

import {
  getDayMonthYear,
} from "../utils";

const Container = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${colors.background};
`;

const CartContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${colors.textColorPrimary};
`;

const TextContainer = styled.Text`
  font-size: 20;
  font-weight: bold;
  padding-left: 10;
`;

const CoopTextContainer = styled.Text`
  font-size: 14;
  font-weight: bold;
  padding-right: 10;
`;

const CoopTextDateContainer = styled.Text`
  font-size: 20;
  text-align: center;
  font-weight: bold;
  padding-right: 10;
`;

export const RepeatSum = ({ value, sendOrder, currencyName }) => (
  <Container>
    <TextContainer>{`${value.toFixed(2)} ${currencyName}`}</TextContainer>

    <Button fontSize="10" text={strings("componentSum.repeatOrder")} onPress={sendOrder} />
  </Container>
);

export const RepeatDirectSum = ({ value, sendOrder, currencyName }) => (
  <Container>
    <TextContainer>{`${value.toFixed(2)} ${currencyName}`}</TextContainer>

    <Button fontSize="10" text={strings("componentSum.orderSpecificGoods")} onPress={sendOrder} />
  </Container>
);

export const Sum = ({ value, sendOrder, currencyId, disabled }) => (
  <CartContainer>
    {
      currencyId === "1"
        ? <TextContainer>{`${value.toFixed(2)} USD`}</TextContainer>
        : currencyId === "2"
          ? <TextContainer>{`${value.toFixed(2)} ₽`}</TextContainer>
          : currencyId === "3"
            ? <TextContainer>{`${value.toFixed(2)} EUR`}</TextContainer>
            : <TextContainer>{`${value.toFixed(2)} RMB`}</TextContainer>
    }

    <Button disabled={disabled} fontSize="12" text={strings("componentSum.sendOrder")} onPress={sendOrder} />
  </CartContainer>
);

export const ConfirmSum = ({ value, sendOrder,currencyId }) => (
  <Container>
    {
      currencyId === "1"
        ? <TextContainer>{`${value.toFixed(2)} USD`}</TextContainer>
        : currencyId === "2"
          ? <TextContainer>{`${value.toFixed(2)} ₽`}</TextContainer>
          : currencyId === "3"
            ? <TextContainer>{`${value.toFixed(2)} EUR`}</TextContainer>
            : <TextContainer>{`${value.toFixed(2)} RMB`}</TextContainer>
    }
    <Button fontSize="12" text={strings("priceDetail.issueOrder")} onPress={sendOrder} />
  </Container>
);

export const CoopSum = ({ value, enddate, sendOrder, currencyId }) => {
  const { day, month, year } = getDayMonthYear(+enddate);
  
  return (
    <Container>
      {
        currencyId === "1"
          ? <TextContainer>{`${value.toFixed(2)} USD`}</TextContainer>
          : currencyId === "2"
            ? <TextContainer>{`${value.toFixed(2)} ₽`}</TextContainer>
            : currencyId === "3"
              ? <TextContainer>{`${value.toFixed(2)} EUR`}</TextContainer>
              : <TextContainer>{`${value.toFixed(2)} RMB`}</TextContainer>
      }
      {/* <View style={{ flexDirection: "column" }}>
        <CoopTextContainer>Заказ отправится автоматически:</CoopTextContainer>
        <CoopTextDateContainer>{day}.{month}.{year}</CoopTextDateContainer>
      </View> */}
      {/* Заказ отправится автоматически дата */}
      <Button fontSize="12" text={strings("priceDetail.issueOrder")} onPress={sendOrder} />
    </Container>
  );
};
