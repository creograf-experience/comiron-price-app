import { createStackNavigator } from "react-navigation-stack";

import {
  MainScreen,
  PriceDetailScreen,
  ProductDetailScreen,
  OrderDetailScreen,
  ContactScreen,
  ShopInfoScreen,
  CategoryScreen,
  CoopPriceDetailScreen,
  CoopOrderDetailScreen,
  CoopProductDetailScreen,
  ShopSearchResultScreen,
} from "../screens";

import { GroupScreen } from "../screens/GroupScreen";
import { BarCodeScannerScreen } from "../screens/BarCodeScannerScreen";
import { StandardCommentScreen } from "../screens/StandardCommentScreen"
import { OrderDetailSecondScreen } from "../screens/OrderDetailSecondScreen";

import { SelectDeliveryScreen } from "../screens/SelectDeliveryScreen";
import { SelectAddressScreen } from "../screens/SelectAddressScreen";
import { AddAddressScreen } from "../screens/AddAddressScreen";
import { SelectPaymentScreen } from "../screens/SelectPaymentScreen";

import {
  MAIN_SCREEN,
  PRICE_DETAIL_SCREEN,
  PRODUCT_DETAIL_SCREEN,
  ORDER_DETAIL_SCREEN,
  ORDER_DETAIL_SECOND_SCREEN,
  CONTACT_SCREEN,
  SHOP_INFO_SCREEN,
  CATEGORY_SCREEN,
  COOP_PRICE_DETAIL_SCREEN,
  COOP_ORDER_DETAIL_SCREEN,
  COOP_PRODUCT_DETAIL_SCREEN,
  GROUP_SCREEN,
  BAR_CODE_SCANNER_SCREEN,
  SHOP_SEARCH_RESULT_SCREEN,
  STANDARD_COMMENT_SCREEN,
  SELECT_DELIVERY_SCREEN,
  SELECT_ADDRESS_SCREEN,
  ADD_ADDRESS_SCREEN,
  SELECT_PAYMENT_SCREEN
} from "../constants";


const MainStack = createStackNavigator(
  {
    [MAIN_SCREEN]: {
      screen: MainScreen
    },
    [SHOP_INFO_SCREEN]: {
      screen: ShopInfoScreen
    },
    [PRICE_DETAIL_SCREEN]: {
      screen: PriceDetailScreen
    },
    [GROUP_SCREEN]: {
      screen: GroupScreen,
    },
    [ORDER_DETAIL_SCREEN]: {
      screen: OrderDetailScreen
    },
    [ORDER_DETAIL_SECOND_SCREEN]: {
      screen: OrderDetailSecondScreen,
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
    [CATEGORY_SCREEN]: {
      screen: CategoryScreen,
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
    [BAR_CODE_SCANNER_SCREEN]: {
      screen: BarCodeScannerScreen
    },
    [SHOP_SEARCH_RESULT_SCREEN]: {
      screen: ShopSearchResultScreen,
    },
    [STANDARD_COMMENT_SCREEN]: {
      screen: StandardCommentScreen
    }
  },
  {
    initialRouteName: MAIN_SCREEN,
  }
);

export default MainStack;
