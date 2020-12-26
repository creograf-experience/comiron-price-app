import { createStackNavigator } from "react-navigation-stack";

import { RegisterScreen,UserAgreementScreen } from "../screens";
import { REGISTER_SCREEN,USER_AGREEMENT_SCREEN } from "../constants";

const RegisterStack = createStackNavigator(
  {
    [REGISTER_SCREEN]: {
      screen: RegisterScreen
    },
    [USER_AGREEMENT_SCREEN]: {
      screen: UserAgreementScreen
    }
  },
  {
    initialRouteName: REGISTER_SCREEN
  }
);

export default RegisterStack;
