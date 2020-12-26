import React from "react";
import { Platform, Dimensions } from "react-native";
import { Text } from "react-native-elements";
import styled from "styled-components";

const windowHeight = Dimensions.get('window').height;

const IOS = styled.Text`
  flex: 1;
  height: 100%;
  align-items: center;
  margin-bottom: 5;
  margin-top: ${windowHeight > 667 ? 0 : 15};
  text-align: center;
  font-size: 20;
  font-weight: 700;
  width: 230;
`;

const Android = styled.Text`
  flex: 1;
  align-items: center;
  text-align: center;
  font-size: 20;
  font-weight: 700;
  width: 250;
  right: 15;
`;

export const PriceDetailHeader = ({ title, color }) => (
  Platform.OS === "ios"
    ? <IOS style={{ color: color }} numberOfLines={2} elliosizeMode={"tail"}>{title}</IOS>
    : <Android style={{ color: color }} numberOfLines={2} elliosizeMode={"tail"}>{title}</Android>
);
