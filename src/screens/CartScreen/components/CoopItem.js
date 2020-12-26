import React from "react";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";
import { withNavigation } from "react-navigation";

import { COOP_ORDER_DETAIL_SCREEN, SHOP_INFO_SCREEN, colors } from "../../../constants";

import { Photo, CoopCartPrice } from "../../MainScreen/components";

const CoopItem = ({ item, prices, onRefresh, navigation  }) => {
  const userShopList = [];
  const price = prices.find(price => price.id === item.price_id);

  return (
    <TouchableOpacity
      activeOpacity={0.4}
      underlayColor="#44454a"
      onPress={() => {
        navigation.navigate(COOP_ORDER_DETAIL_SCREEN, {
          personId: item.shop.person_id,
          title: item.shop.name,
          priceId: item.price_id,
          shopId: item.shop.id,
          currencyId: item.currency.id,
          cart: [],
          selected: [],
          onCartRefresh: onRefresh,
          prices: prices,
          enddate: price.enddate,
        })
      }}
    >
      <View 
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 15,
          backgroundColor: "white",
          shadowOffset: {width: 5, height: 0},
          shadowColor: "rgba(0, 0, 0, 0.05)",
          shadowRadius: 5,
          shadowOpacity: 1,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(SHOP_INFO_SCREEN, { 
              userShopList: userShopList,
              shop: item.shop,
              allShops: !userShopList.includes(item.shop),
              fromPrice: true, 
            });
          }}
          style={styles.triangleCorner}
        >
          <Photo shop={item.shop} />
        </TouchableOpacity>

        <CoopCartPrice
          name={price ? price.name : ""}
          date={price ? price.enddate : 0}
          shop={item.shop}
          sum={item.sum}
          currencyName={item.currency.name}
        />

      </View>
        
    </TouchableOpacity>  
  );
};

const styles = StyleSheet.create({
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
});

export default withNavigation(CoopItem);
