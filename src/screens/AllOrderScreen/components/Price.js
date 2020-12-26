import React from "react";
import styled from "styled-components";

import { StyleSheet, View, Text, Platform, Dimensions } from "react-native";

import {
  Info,
  TopContainer,
} from "../../../components/Price/index";
import { Photo } from "../../MainScreen/components";
import { hostImages, colors } from "../../../constants";
import { ShopLogo } from "../../../components/index";
import { strings } from "../../../../locale/i18n";

const { width } = Dimensions.get('window');

export const JustText = styled.Text`
  font-size: 12;
  color: ${colors.dataColor};
`;

const MainText = styled.Text`
  color: black;
`;

const StatusOkText = styled.Text`
  font-size: 12;
  color: ${colors.statusOk};
  text-align: right;
`;

const StatusDeniedText = styled.Text`
  font-size: 12;
  color: ${colors.statusDenied};
  text-align: right;
`;

export const Price = ({
  name,
  date,
  thumbnail_url,
  numberOrder,
  sum,
  numberPosition,
  currencyName,
  status,
  comment_shop,
  flag = false,
  is_sz,
  item,
  deliverystate,
  delivery,
}) => {
  const month =
    new Date(+date).getMonth() + 1 >= 9
      ? new Date(+date).getMonth() + 1
      : `0${new Date(+date).getMonth() + 1}`;
  return (
    <View style={[ styles.container, { paddingBottom: is_sz == 1 ? 22 : 15, height: flag ? 120 : null, } ]}>
      {
        is_sz == 1 ? (
          <View style={styles.triangleCorner} > 
            <Photo shop={item} />
          </View>
        ) : (
          <ShopLogo source={{ uri: `${hostImages}${thumbnail_url}` }} />
        )
      }

      <Info>
        {
          status === "order_status_new" ? (
            <StatusOkText>{strings("allOrderScreen.statusNew")}</StatusOkText>
          ) : 
          status === "order_status_inprocess" ? (
            <StatusOkText>{strings("allOrderScreen.statusInprocess")}</StatusOkText>
          ) :
          status === "order_status_done" ? (
            <StatusOkText>{strings("allOrderScreen.statusDone")}</StatusOkText>
          ) :
          status === "order_status_denied" ? (
            <StatusDeniedText>{strings("allOrderScreen.statusDenied")}</StatusDeniedText>
          ) :
          status === "order_status_user_denied" ? (
            <StatusDeniedText>{strings("allOrderScreen.statusUserDenied")}</StatusDeniedText>
          ) :
          status === "order_status_delivery" ? (
            <StatusOkText>{strings("allOrderScreen.statusDelivery")}</StatusOkText>
          ) : <JustText>{''}</JustText>
        }
        <TopContainer>
          <Text style={{ fontSize: 14, color: colors.colorPrimary, marginLeft: is_sz == 1 ? 45 : 0 }}>№ {numberOrder} - {name}</Text>
        </TopContainer>

        <TopContainer>
          <Text style={{ color: "black", marginLeft: is_sz == 1 ? 45 : 0 }}>{strings("allOrderScreen.sum")} {sum} {currencyName} / </Text>
          <MainText>{strings("allOrderScreen.position")} {numberPosition}</MainText>
        </TopContainer>

        <TopContainer>
          <Text style={{ fontSize: 12, color: colors.dataColor, marginLeft: is_sz == 1 ? 45 : 0 }}>{`${new Date(+date).getDate()}.${month}.${new Date(
              +date
            ).getFullYear()}`}
          </Text>
          {
            flag === true ? (
              <JustText>{comment_shop}</JustText>
            ) : (
              <JustText numberOfLines={1} ellipsizeMode={"tail"}>{comment_shop}</JustText>
            )
          }
        </TopContainer>
          <View style={{ flexDirection: "row" }}>
            <Text style={{
              fontSize: 14,
              marginLeft: is_sz == 1 ? 44 : 0
            }}>{strings("allOrderScreen.deliveryState")} </Text>
            <View
              // style={{
              //   backgroundColor: colors.colorPrimary,
              //   borderTopLeftRadius: 5,
              //   borderTopRightRadius: 5,
              //   borderBottomLeftRadius: 5,
              //   borderBottomRightRadius: 5,
              // }}
            >
              {
                delivery == "pek" ? (
                  <Text style={styles.deliveryTextStyle}>{deliverystate}</Text>
                ) :
                delivery == "dpd" && deliverystate == "NewOrderByClient" ? (
                  <Text style={styles.deliveryTextStyle}>{strings("allOrderScreen.NewOrderByClient")}</Text>
                ) :
                delivery == "dpd" && deliverystate == "NotDone" ? (
                  <Text style={styles.deliveryTextStyle}>{strings("allOrderScreen.NotDone")}</Text>
                ) :
                delivery == "dpd" && deliverystate == "OnTerminalPickup" ? (
                  <Text style={styles.deliveryTextStyle}>{strings("allOrderScreen.OnTerminalPickup")}</Text>
                ) :
                delivery == "dpd" && deliverystate == "OnRoad" ? (
                  <Text style={styles.deliveryTextStyle}>{strings("allOrderScreen.OnRoad")}</Text>
                ) :
                delivery == "dpd" && deliverystate == "OnTerminal" ? (
                  <Text style={styles.deliveryTextStyle}>{strings("allOrderScreen.OnTerminal")}</Text>
                ) :
                delivery == "dpd" && deliverystate == "OnTerminalDelivery" ? (
                  <Text style={styles.deliveryTextStyle}>{strings("allOrderScreen.OnTerminalDelivery")}</Text>
                ) :
                delivery == "dpd" && deliverystate == "Delivering" ? (
                  <Text style={styles.deliveryTextStyle}>{strings("allOrderScreen.Delivering")}</Text>
                ) :
                delivery == "dpd" && deliverystate == "Delivered" ? (
                  <Text style={styles.deliveryTextStyle}>{strings("allOrderScreen.Delivered")}</Text>
                ) :
                delivery == "dpd" && deliverystate == "Lost" ? (
                  <Text style={styles.deliveryTextStyle}>{strings("allOrderScreen.Lost")}</Text>
                ) :
                delivery == "dpd" && deliverystate == "Problem" ? (
                  <Text style={styles.deliveryTextStyle}>{strings("allOrderScreen.Problem")}</Text>
                ) :
                delivery == "dpd" && deliverystate == "ReturnedFromDelivery" ? (
                  <Text style={styles.deliveryTextStyle}>{strings("allOrderScreen.ReturnedFromDelivery")}</Text>
                ) :
                delivery == "dpd" && deliverystate == "NewOrderByDPD" ? (
                  <Text style={styles.deliveryTextStyle}>{strings("allOrderScreen.NewOrderByDPD")}</Text>
                ) : null
              }
            </View>
          </View>
      </Info>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.textColorPrimary,
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    shadowOffset: {width: 5, height: 0},
    shadowColor: "rgba(0, 0, 0, 0.05)",
    shadowRadius: 5,
    shadowOpacity: 1,
  },
  triangleCorner: {
    flexDirection: "column",
    alignSelf: "flex-start",
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderRightWidth: 25,
    borderTopWidth: 25,
    borderRightColor: "transparent",
    borderTopColor: colors.colorPrimary,
  },
  deliveryTextStyle: {
    width: Platform.OS == "ios" && width <= 360 ? 140 : 220,
    fontSize: 14,
    color: colors.colorPrimary,
  },
});
