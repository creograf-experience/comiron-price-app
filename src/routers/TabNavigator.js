import { createBottomTabNavigator } from 'react-navigation-tabs';
import React from "react";
import { Image, View, Text } from 'react-native';
import { connect } from "react-redux";

import MainStack from "./MainStack";
import { colors } from "../constants/colors";
import ProfileStack from "./ProfileStack";
import CartStack from "./CartStack";
import NotificationStack from "./NotificationStack";
import ChatStack from './ChatStack';
import RecShopsStack from "./RecShopsStack";

const Counter = ({ cart, cartSZ }) => {
  if ((cart === 0 || cart.cartLength === 0) && (cartSZ === 0 || cartSZ.cartSZ_Length === 0)) return null;

  return(
    <View style={{
      backgroundColor: colors.colorPrimary,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      height: 20,
      width: 20,
      marginBottom: 20,
      marginLeft: 25,
      position: "absolute",
    }}>
      <Text style={{ color: "white", fontSize: 12 }}>
        {cart.cartLength + cartSZ.cartSZ_Length}
      </Text>
    </View>
  );
};

const mapStateToProps = state => ({
  cart: state.order.cartLength,
  cartSZ: state.order.cartSZ_Length,
});
const ConnectedCounter = connect(mapStateToProps, null)(Counter);
export { ConnectedCounter as Counter };

const TabNavigator = createBottomTabNavigator(
  {
    Магазины: {
      screen: RecShopsStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Image
            style={{
              height: 35,
              width: 35,
              tintColor: tintColor,
              resizeMode: "contain",
            }}
            source={require("../../assets/shops-svg.png")}
          />
        ),
      }
    },
    Прайсы: {
      screen: MainStack,
      navigationOptions: {
        // tabBarOnPress: ({ navigation, defaultHandler }) => { navigation.popToTop(); defaultHandler(); },
        tabBarIcon: ({ tintColor }) => (
          <Image
            style={{
              height: 30,
              width: 30,
              tintColor: tintColor,
              resizeMode: "contain",
            }}
            source={require("../../assets/pricelist-svg.png")}
          />
        ),
      }
    },
    Чаты: {
      screen: ChatStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Image
            style={{
              height: 30,
              width: 30,
              tintColor: tintColor,
              resizeMode: "contain",
            }}
            source={require("../../assets/notifications.png")}
          />
        ),
      }
    },
    Корзина: {
      screen: CartStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <View style={{ flexDirection: "row" }}>
            <Image
              style={{
                height: 30,
                width: 30,
                tintColor: tintColor,
                resizeMode: "contain",
              }}
              source={require("../../assets/coop-purchases-svg.png")}
            />
            <ConnectedCounter />
          </View>
        ),
      }
    },
    Профиль: {
      screen: ProfileStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Image
            style={{
              height: 30,
              width: 30,
              tintColor: tintColor,
              resizeMode: "contain",
            }}
            source={require("../../assets/profile-svg.png")}
          />
        ),
      }
    },
  },
  {
    initialRouteName: "Прайсы",
    tabBarOptions: {
      activeTintColor: colors.colorPrimary,
      inactiveTintColor: colors.dataColor,
      showLabel: false,
    }
  },
);

export default TabNavigator;
