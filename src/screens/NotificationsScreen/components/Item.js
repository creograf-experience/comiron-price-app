import React from "react";
import { TouchableOpacity, View } from "react-native";
import { withNavigation } from "react-navigation";

import { getDayMonthYear } from "../../../utils";

import { ALL_ORDER_DETAIL_SCREEN, SHOP_INFO_SCREEN } from "../../../constants";
import { colors } from "../../../constants";

import { Photo, TitleText, JustText } from "../../MainScreen/components";
import { Container, Name } from "../../../components";

const Item = ({ item, userShopDetailList, navigation, userShopList }) => {
  const { day, month, year } = getDayMonthYear(+item.date * 1000);

  const navigateToShop = () =>
    navigation.navigate(SHOP_INFO_SCREEN, { 
      shop: item.shop,
      userShopList,
      allShops: !userShopList.includes(userShopDetailList),
    });

  const navigateToOrderDetail = () =>
    navigation.navigate(ALL_ORDER_DETAIL_SCREEN, {
      numberOrder: item.order.id,
      shopId: item.order.shop_id,
      title: item.shop.name,
      date: item.order.dataorder * 1000,
      thumbnail_url: item.shop.thumbnail_url,
      sum: item.order.sum,
      numberPosition: item.order.numpack,
      currency: item.order.currency,
      status: item.order.status,
      comment_shop: item.order.comment_shop,
      details: item.order.details,
      is_sz: item.order.is_sz,
    });

  return(
    <TouchableOpacity
      style={{
        borderBottomColor: colors.background,
        borderBottomWidth: 3,
      }}
      onPress={item.order_id !== "0" && item.order_id ? navigateToOrderDetail : navigateToShop}
    >
      <Container 
        style={{
          shadowOffset: {width: 5, height: 0},
          shadowColor: "rgba(0, 0, 0, 0.05)",
          shadowRadius: 5,
          shadowOpacity: 1,
        }}
        isViewed
      >
        <Photo shop={item.shop} />

        <View style={{ flex: 1 }}>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TitleText style={{ flex: 7 }}>{item.title}</TitleText>

            <View style={{ flex: 3, alignItems: "flex-end" }}>
              <JustText>{`${day}.${month}.${year}`}</JustText>
            </View>
          </View>

          <Name>
            {item.message}
          </Name>
        </View>
      </Container>
    </TouchableOpacity>  
  );
};

export default withNavigation(Item);
