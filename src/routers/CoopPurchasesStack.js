import { createStackNavigator } from "react-navigation-stack";
import React from "react";
import { Image } from "react-native";

import { 
  CooperativePurchasesScreen,
  CoopPriceDetailScreen,
  CoopOrderDetailScreen,
  CoopProductDetailScreen,
} from "../screens";

import { 
  COOP_PURCHASES_SCREEN,
  COOP_PRICE_DETAIL_SCREEN,
  COOP_ORDER_DETAIL_SCREEN,
  COOP_PRODUCT_DETAIL_SCREEN,
  colors,
} from "../constants";


const CoopPurchasesStack = createStackNavigator(
  {
    [COOP_PURCHASES_SCREEN]: {
      screen: CooperativePurchasesScreen
    },
    [COOP_PRICE_DETAIL_SCREEN]: {
      screen: CoopPriceDetailScreen
    },
    [COOP_ORDER_DETAIL_SCREEN]: {
      screen: CoopOrderDetailScreen
    },
    [COOP_PRODUCT_DETAIL_SCREEN]: {
      screen: CoopProductDetailScreen
    },
  },
  {
    initialRouteName: COOP_PURCHASES_SCREEN,
    navigationOptions: {
      tabBarColor: colors.colorSecondary,
      tabBarIcon: <Image
        style={{ height: 25, width: 25 }}
        source={require("../../assets/crowd.png")}
      />,
    }
  }
);

export default CoopPurchasesStack;
