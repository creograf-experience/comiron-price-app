import { createStackNavigator } from "react-navigation-stack";

import { AuthenticationScreen } from "../screens";
import { AUTHENTICATION_SCREEN } from "../constants";

const AuthenticationStack = createStackNavigator(
  {
    [AUTHENTICATION_SCREEN]: {
      screen: AuthenticationScreen
    }
  },
  {
    initialRouteName: AUTHENTICATION_SCREEN
  }
);

export default AuthenticationStack;
