import React from "react";
import styled from "styled-components";
import { View } from "react-native";
import {
  Info,
  TopContainer,
  BottomContainer,
  Name,
  NumOrders,
} from "../../../components/Price/index";
import { colors } from "../../../constants";
import { DaysLeft, MainDaysLeft } from "../../../components";

export const JustText = styled.Text`
  font-size: 12;
  color: ${colors.dataColor};
`;

export const TitleText = styled.Text`
  color: ${colors.colorPrimary};
  font-size: 14;
`;
const NumOrderText = styled.Text`
  color: white;
`;


export const Price = ({ name, date, shop, numOrders }) => {
  const month =
    new Date(+date).getMonth() + 1 >= 9
      ? new Date(+date).getMonth() + 1
      : `0${new Date(+date).getMonth() + 1}`;

  return (
    <View style={{ flex: 1 }} >
      <Info>
        <TopContainer>
          <TitleText>{shop.name}</TitleText>
        </TopContainer>
        {
          numOrders ? (
            <BottomContainer>
              <Name>{name}</Name>
              <NumOrders>
                <NumOrderText>{numOrders}</NumOrderText>
              </NumOrders>
            </BottomContainer>
          ) 
          : <Name>{name}</Name>
        }
        <JustText>{`${new Date(+date).getDate()}.${month}.${new Date(
            +date
          ).getFullYear()}`}</JustText>
      </Info>
    </View>
  );
};

export const CoopPrice = ({ name, date, shop, numOrders }) => {
  return (
    <View style={{ flex: 1 }} >
      <Info>
        <TopContainer>
          <TitleText>{shop.name}</TitleText>
        </TopContainer>
        {
          numOrders ? (
            <BottomContainer>
              <Name>{name}</Name>
              <NumOrders>
                <NumOrderText>{numOrders}</NumOrderText>
              </NumOrders>
            </BottomContainer>
          )
          : <Name>{name}</Name>
        }

        <DaysLeft dateStr={+date} />
      </Info>
    </View>
  );
};

export const CoopMainPrice = ({ name, date, shop, numOrders }) => {
  return (
    <View style={{ flex: 1, marginLeft: 45, paddingBottom: 10 }} >
      <Info>
        <TopContainer>
          <TitleText>{shop.name}</TitleText>
        </TopContainer>
        {
          numOrders ? (
            <BottomContainer>
              <Name>{name}</Name>
            </BottomContainer>
          )
          : <Name>{name}</Name>
        }
        <MainDaysLeft dateStr={+date} />
      </Info>
    </View>
  );
};

export const CoopCartPrice = ({ name, date, shop, sum, currencyName }) => {
  return (
    <View style={{ flex: 1, marginLeft: 45, paddingBottom: 10 }} >
      <Info>
        <TopContainer>
          <TitleText>{shop.name}</TitleText>
        </TopContainer>
        <Name>{name}</Name>
        <Name>
          {sum} {currencyName}
        </Name>
        <MainDaysLeft dateStr={+date} />
      </Info>
    </View>
  );
};