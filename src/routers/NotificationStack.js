import { createStackNavigator } from "react-navigation-stack";

import { NotificationsScreen } from "../screens/NotificationsScreen";
import { GroupScreen } from "../screens/GroupScreen";
import {
  AllOrderDetailScreen,
  ShopInfoScreen,
} from "../screens";

import {
  NOTIFICATIONS_SCREEN,
  ALL_ORDER_DETAIL_SCREEN,
  SHOP_INFO_SCREEN,
  GROUP_SCREEN,
} from "../constants";

const NotificationsStack = createStackNavigator(
  {
    [NOTIFICATIONS_SCREEN]: {
      screen: NotificationsScreen
    },
    [SHOP_INFO_SCREEN]: {
      screen: ShopInfoScreen
    },
    [ALL_ORDER_DETAIL_SCREEN]: {
      screen: AllOrderDetailScreen
    },
    [GROUP_SCREEN]: {
      screen: GroupScreen
    },
  },
  {
    initialRouteName: NOTIFICATIONS_SCREEN
  }
);

export default NotificationsStack;
