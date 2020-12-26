import { createStackNavigator } from "react-navigation-stack";

import {
  ProfileScreen,
  AllOrderScreen,
  AllOrderDetailScreen,
  ShopsScreen,
  ShopInfoScreen,
  PriceDetailScreen,
  OrderDetailScreen,
  ProductDetailScreen,
  ContactScreen,
  ShopSearchResultScreen,
  CategoryScreen
} from "../screens";

import { MyShopClientsScreen } from "../screens/MyShopClientsScreen";
import { ClientInfoScreen } from "../screens/ClientInfoScreen";
import { MyProfileScreen } from "../screens/MyProfileScreen";
import { StandardCommentScreen } from "../screens/StandardCommentScreen";
import { NotificationsScreen } from "../screens/NotificationsScreen";
import { GroupScreen } from "../screens/GroupScreen";

import { BarCodeScannerScreen } from "../screens/BarCodeScannerScreen";
import { OrderDetailSecondScreen } from "../screens/OrderDetailSecondScreen";

import { SelectDeliveryScreen } from "../screens/SelectDeliveryScreen";
import { SelectAddressScreen } from "../screens/SelectAddressScreen";
import { AddAddressScreen } from "../screens/AddAddressScreen";
import { SelectPaymentScreen } from "../screens/SelectPaymentScreen";
import { ChooseStaffShopsChatScreen } from '../screens/ChooseStaffShopsChatScreen';
import { ActiveChatScreen } from '../screens/ActiveChatScreen'

import {
  PROFILE_SCREEN,
  ALL_ORDER_SCREEN,
  ALL_ORDER_DETAIL_SCREEN,
  MY_SHOP_CLIENTS_SCREEN,
  CLIENT_INFO_SCREEN,
  MY_PROFILE_SCREEN,
  STANDARD_COMMENT_SCREEN,
  SHOPS_SCREEN,
  NOTIFICATIONS_SCREEN,
  SHOP_INFO_SCREEN,
  PRICE_DETAIL_SCREEN,
  ORDER_DETAIL_SCREEN,
  PRODUCT_DETAIL_SCREEN,
  CONTACT_SCREEN,
  SHOP_SEARCH_RESULT_SCREEN,
  CATEGORY_SCREEN,
  GROUP_SCREEN,
  BAR_CODE_SCANNER_SCREEN,
  ORDER_DETAIL_SECOND_SCREEN,
  SELECT_DELIVERY_SCREEN,
  SELECT_ADDRESS_SCREEN,
  ADD_ADDRESS_SCREEN,
  SELECT_PAYMENT_SCREEN,
  CHOOSE_STAFF_SHOPS_CHAT_SCREEN,
  ACTIVE_CHAT_SCREEN
} from "../constants";


const ProfileStack = createStackNavigator(
  {
    [PROFILE_SCREEN]: {
      screen: ProfileScreen
    },
    [ALL_ORDER_SCREEN]: {
      screen:AllOrderScreen
    },
    [ALL_ORDER_DETAIL_SCREEN]: {
      screen: AllOrderDetailScreen
    },

    [MY_SHOP_CLIENTS_SCREEN]: {
      screen: MyShopClientsScreen
    },

    [CLIENT_INFO_SCREEN]: {
      screen: ClientInfoScreen
    },
    [MY_PROFILE_SCREEN]: {
      screen: MyProfileScreen
    },
    [STANDARD_COMMENT_SCREEN]: {
      screen: StandardCommentScreen
    },
    [NOTIFICATIONS_SCREEN]: {
      screen: NotificationsScreen
    },
    [SHOPS_SCREEN]: {
      screen: ShopsScreen,
    },
    [SHOP_INFO_SCREEN]: {
      screen: ShopInfoScreen,
    },
    [CHOOSE_STAFF_SHOPS_CHAT_SCREEN]: {
      screen: ChooseStaffShopsChatScreen
    },
    [ACTIVE_CHAT_SCREEN]: {
      screen: ActiveChatScreen
    },
    [PRICE_DETAIL_SCREEN]: {
      screen: PriceDetailScreen
    },
    [GROUP_SCREEN]: {
      screen: GroupScreen,
    },
    [ORDER_DETAIL_SCREEN]:{
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
    [PRODUCT_DETAIL_SCREEN]: {
      screen: ProductDetailScreen,
    },
    [CONTACT_SCREEN]: {
      screen: ContactScreen,
    },
    [SHOP_SEARCH_RESULT_SCREEN]: {
      screen: ShopSearchResultScreen,
    },
    [CATEGORY_SCREEN]: {
      screen: CategoryScreen,
    },
    [BAR_CODE_SCANNER_SCREEN]: {
      screen: BarCodeScannerScreen,
    }
  },
  {
    initialRouteName: PROFILE_SCREEN
  }
);

export default ProfileStack;