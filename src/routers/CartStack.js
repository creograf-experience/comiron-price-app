import { createStackNavigator } from "react-navigation-stack";

import { CartScreen } from "../screens/CartScreen";
import { OrderDetailScreen } from "../screens";
import { OrderDetailSecondScreen } from "../screens/OrderDetailSecondScreen";

import { SelectDeliveryScreen } from "../screens/SelectDeliveryScreen";
import { SelectAddressScreen } from "../screens/SelectAddressScreen";
import { AddAddressScreen } from "../screens/AddAddressScreen";
import { SelectPaymentScreen } from "../screens/SelectPaymentScreen";

import {
  CART_SCREEN,
  ORDER_DETAIL_SCREEN,
  STANDARD_COMMENT_SCREEN,
  ORDER_DETAIL_SECOND_SCREEN,
  COOP_ORDER_DETAIL_SCREEN,
  SELECT_DELIVERY_SCREEN,
  SELECT_ADDRESS_SCREEN,
  ADD_ADDRESS_SCREEN,
  SELECT_PAYMENT_SCREEN
} from "../constants";
import { StandardCommentScreen } from "../screens/StandardCommentScreen";
import { CoopOrderDetailScreen } from "../screens/CoopPurchases/CoopOrderDetailScreen";

const CartStack = createStackNavigator(
  {
    [CART_SCREEN]: {
      screen: CartScreen
    },
    [ORDER_DETAIL_SCREEN]: {
      screen: OrderDetailScreen
    },
    [ORDER_DETAIL_SECOND_SCREEN]: {
      screen: OrderDetailSecondScreen
    },
    [SELECT_DELIVERY_SCREEN]: {
      screen: SelectDeliveryScreen
    },
    [SELECT_ADDRESS_SCREEN]: {
      screen: SelectAddressScreen
    },
    [ADD_ADDRESS_SCREEN]: {
      screen: AddAddressScreen
    },
    [SELECT_PAYMENT_SCREEN]: {
      screen: SelectPaymentScreen
    },
    [STANDARD_COMMENT_SCREEN]: {
      screen: StandardCommentScreen
    },
    [COOP_ORDER_DETAIL_SCREEN]: {
      screen: CoopOrderDetailScreen
    },
  },
  {
    initialRouteName: CART_SCREEN
  }
);

export default CartStack;
