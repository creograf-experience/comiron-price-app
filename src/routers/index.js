import { createSwitchNavigator, createAppContainer } from "react-navigation";

import {
  AUTHENTICATION_STACK,
  REGISTER_STACK,
  TAB_NAVIGATOR,
  PASSWORD_RESET_STACK,
  SBER_BANK_STACK
} from "../constants";
import AuthenticationStack from "./AuthenticationsStack";
import TabNavigator from "./TabNavigator";
import RegisterStack from "./RegisterStack";
import PasswordResetStack from "./PasswordResetStack";
import SberBankStack from "./SberBankStack";

const root = createSwitchNavigator(
  {
    [AUTHENTICATION_STACK]: {
      screen: AuthenticationStack
    },
    [REGISTER_STACK]: {
      screen: RegisterStack
    },
    [TAB_NAVIGATOR]: {
      screen: TabNavigator
    },
    [PASSWORD_RESET_STACK]: {
      screen: PasswordResetStack
    },
    [SBER_BANK_STACK]: {
      screen: SberBankStack
    }
  },
  {}
);

export default createAppContainer(root);
