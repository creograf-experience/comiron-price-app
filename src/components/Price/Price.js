import React from "react";
import styled from "styled-components";
import { View, Text } from "react-native";
import {
  Container,
  Info,
  TopContainer,
  BottomContainer,
  Name,
  NumOrders,
} from "../../components";
import { hostImages } from "../../constants";
import { ShopLogo, DaysLeft } from "../../components";
import notAvailable from "../../../assets/not-available.png";
import { colors } from "../../constants/colors";

export const JustText = styled.Text`
  font-size: 12;
  color: ${colors.dataColor};
`;

export const JustMainText = styled.Text`
  font-size: 12;
  color: ${colors.colorPrimary};
`;

export const JustEndText = styled.Text`
  font-size: 16;
  font-weight: bold;
  color: ${colors.colorPrimary};
`;

const TitleText = styled.Text`
  color: ${colors.colorPrimary};
  font-size: 14;
`;
const NumOrderText = styled.Text`
  color: white;
`;

const TitleShopText = styled.Text`
  color: ${colors.colorPrimary};
  font-size: 18;
  margin-top: 20;
`;

export const Price = ({ name, date, shop, isViewed, numOrders }) => {
  const month =
    new Date(+date).getMonth() + 1 >= 9
      ? new Date(+date).getMonth() + 1
      : `0${new Date(+date).getMonth() + 1}`;

  const image = shop.thumbnail_url ? (
    <ShopLogo source={{ uri: `${hostImages}${shop.thumbnail_url}` }} />
  ) : (
    <ShopLogo source={notAvailable} />
  );

  return (
    <Container
      style={{
        shadowOffset: {width: 5, height: 0},
        shadowColor: "rgba(0, 0, 0, 0.05)",
        shadowRadius: 5,
        shadowOpacity: 1,
      }}
      isViewed={isViewed}
    >
      {image}

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
          : (
            <Name>{name}</Name>
          )
        }
        <JustText>{`${new Date(+date).getDate()}.${month}.${new Date(
            +date
          ).getFullYear()}`}</JustText>
      </Info>
    </Container>
  );
};

export const CoopPrice = ({ name, date, shop, isViewed, numOrders }) => {
  const image = shop.thumbnail_url ? (
    <ShopLogo source={{ uri: `${hostImages}${shop.thumbnail_url}` }} />
  ) : (
    <ShopLogo source={notAvailable} />
  );

  return (
    <Container
      style={{
        shadowOffset: {width: 5, height: 0},
        shadowColor: "rgba(0, 0, 0, 0.05)",
        shadowRadius: 5,
        shadowOpacity: 1,
      }}
      isViewed={isViewed}
    >
      {image}

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
          : (
            <Name>{name}</Name>
          )
        }
        <DaysLeft dateStr={+date} />
      </Info>
    </Container>
  );
};

export const CoopTimerPrice = ({ name, date, shop, isViewed, numOrders }) => {
  const image = shop.thumbnail_url ? (
    <ShopLogo source={{ uri: `${hostImages}${shop.thumbnail_url}` }} />
  ) : (
    <ShopLogo source={notAvailable} />
  );

  return (
    <Container
      style={{
        shadowOffset: {width: 5, height: 0},
        shadowColor: "rgba(0,0,0,0.05)",
        shadowRadius: 5,
        shadowOpacity: 1,
      }}
      isViewed={isViewed}
    >
      {image}

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
              <DaysLeft dateStr={+date} />
            </BottomContainer>
          )
          : (
            <BottomContainer>
              <Name numberOfLines={1} ellipsizeMode={"tail"}>{name}</Name>
              <DaysLeft dateStr={+date} />
            </BottomContainer>
          )
        }
      </Info>
    </Container>
  );
};

export const GroupPrice = ({ name, isViewed, numOrders }) => {

  return (
    <Container
      style={{
        shadowOffset: {width: 5, height: 0},
        shadowColor: "rgba(0, 0, 0, 0.05)",
        shadowRadius: 5,
        shadowOpacity: 1,
      }}
      isViewed={isViewed}
    >
     <Info>
      {
        numOrders ? (
          <BottomContainer>
            <Name>{name}</Name>
            <NumOrders>
              <NumOrderText>{numOrders}</NumOrderText>
            </NumOrders>
          </BottomContainer>
        )
        : (
          <Name>{name}</Name>
        )
      }
      </Info>
    </Container>
  );
};

export const GroupDetailPrice = ({ shop, isViewed }) => {
  const image = shop.thumbnail_url ? (
    <ShopLogo source={{ uri: `${hostImages}${shop.thumbnail_url}` }} />
  ) : (
    <ShopLogo source={notAvailable} />
  );

  return (
    <Container
      style={{
        shadowOffset: {width: 5, height: 0},
        shadowColor: "rgba(0, 0, 0, 0.05)",
        shadowRadius: 5,
        shadowOpacity: 1,
      }}
      isViewed={isViewed}
    >
      {image}

      <Info>
        <TopContainer>
          <TitleShopText>{shop.name}</TitleShopText>
        </TopContainer>
      </Info>
    </Container>
  );
};