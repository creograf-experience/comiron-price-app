import { createStackNavigator } from "react-navigation-stack";

import { PasswordResetScreen } from "../screens/PasswordResetScreen";
import { PASSWORD_RESET_SCREEN } from "../constants";

const PasswordResetStack = createStackNavigator (
  {
    [PASSWORD_RESET_SCREEN]: {
      screen: PasswordResetScreen
    },
  },
  {
    initialRouteName: PASSWORD_RESET_SCREEN
  }
);

export default PasswordResetStack;
