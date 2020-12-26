import { createStackNavigator } from "react-navigation-stack";
import { SBERBANK_PAYMENT_SCREEN } from "../constants";
import { SberbankPaymentScreen } from "../screens/SberbankPaymentScreen";

const SberBankStack = createStackNavigator(
  {
    [SBERBANK_PAYMENT_SCREEN]: {
      screen: SberbankPaymentScreen
    }
  },
  {
    initialRouteName: SBERBANK_PAYMENT_SCREEN
  }
);

export default SberBankStack;
