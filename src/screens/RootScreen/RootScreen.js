import React, { PureComponent } from "react";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import NavigationService from "../../navigationService/NavigationService";
import { setExpoPushtoken, getExpoPushtoken } from "../../utils";
import {AsyncStorage} from 'react-native';
import AppStack from "../../routers";
import { ContainerWrapper } from "../../components";

export default class RootScreen extends PureComponent {
  async componentDidUpdate(prevProps){
    const {isSocketConnected, connectSocket} = this.props;
    if(prevProps.isSocketConnected && !isSocketConnected){
      if(!await AsyncStorage.getItem("chat-token")) return;
      connectSocket();
    }
  }
  async componentDidMount() {
    await this.registerForPushNotificationsAsync();
  }

  registerForPushNotificationsAsync = async () => {
    try {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
  
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
  
      if (finalStatus !== "granted") {
        return;
      }

      const expoPushToken = await Notifications.getExpoPushTokenAsync();
      console.log(expoPushToken);
      setExpoPushtoken(expoPushToken);

    } catch (err) {
      return console.log(err);
    }
  };

  render() {
    return (
      <ContainerWrapper>
        <AppStack
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
        />
      </ContainerWrapper>
    );
  }
}
