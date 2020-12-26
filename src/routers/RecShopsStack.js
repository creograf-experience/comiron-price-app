import { createStackNavigator } from "react-navigation-stack";

import {RecShopsScreen} from "../screens/RecShopsScreen/index";
import {
  REC_SHOPS_SCREEN, 
  SHOP_INFO_SCREEN,
  PRICE_DETAIL_SCREEN,
  ORDER_DETAIL_SCREEN,
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
  PRODUCT_DETAIL_SCREEN,
  CHOOSE_STAFF_SHOPS_CHAT_SCREEN,
  ACTIVE_CHAT_SCREEN
} from "../constants";
import {
  ShopInfoScreen, 
  PriceDetailScreen,
  OrderDetailScreen,
  ContactScreen,
  ShopSearchResultScreen,
  CategoryScreen,
  ProductDetailScreen
} from "../screens";
import { GroupScreen } from "../screens/GroupScreen";
import { OrderDetailSecondScreen } from "../screens/OrderDetailSecondScreen";
import { SelectDeliveryScreen } from "../screens/SelectDeliveryScreen";
import { SelectAddressScreen } from "../screens/SelectAddressScreen";
import { AddAddressScreen } from "../screens/AddAddressScreen";
import { SelectPaymentScreen } from "../screens/SelectPaymentScreen";
import { BarCodeScannerScreen } from "../screens/BarCodeScannerScreen";
import { ChooseStaffShopsChatScreen } from '../screens/ChooseStaffShopsChatScreen';
import { ActiveChatScreen } from '../screens/ActiveChatScreen'

const RecShopsStack = createStackNavigator(
  {
    [REC_SHOPS_SCREEN]: {screen: RecShopsScreen},
    [SHOP_INFO_SCREEN]: {screen: ShopInfoScreen},
    [CHOOSE_STAFF_SHOPS_CHAT_SCREEN]: {screen: ChooseStaffShopsChatScreen},
    [ACTIVE_CHAT_SCREEN]: {screen: ActiveChatScreen},
    [PRICE_DETAIL_SCREEN]: {screen: PriceDetailScreen},
    [GROUP_SCREEN]: {screen: GroupScreen},
    [ORDER_DETAIL_SCREEN]: {screen: OrderDetailScreen},
    [ORDER_DETAIL_SECOND_SCREEN]: {screen: OrderDetailSecondScreen},
    [SELECT_DELIVERY_SCREEN]: {screen: SelectDeliveryScreen},
    [SELECT_ADDRESS_SCREEN]: {screen: SelectAddressScreen},
    [ADD_ADDRESS_SCREEN]: {screen: AddAddressScreen},
    [SELECT_PAYMENT_SCREEN]: {screen: SelectPaymentScreen},
    [CONTACT_SCREEN]: {screen: ContactScreen},
    [SHOP_SEARCH_RESULT_SCREEN]: {screen: ShopSearchResultScreen},
    [CATEGORY_SCREEN]: {screen: CategoryScreen},
    [BAR_CODE_SCANNER_SCREEN]: {screen: BarCodeScannerScreen},
    [PRODUCT_DETAIL_SCREEN]: {screen: ProductDetailScreen}
  },
  {
    initialRouteName: REC_SHOPS_SCREEN
  }
);

export default RecShopsStack;