import React, { Component } from "react";
import { YellowBox, StatusBar, View, StyleSheet, Platform } from "react-native";
import { AppLoading } from "expo";
import * as ScreenOrientation from 'expo-screen-orientation';
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import ReduxThunk from "redux-thunk";
import { enableScreens  } from 'react-native-screens';

import combinedReducers from "./src/store";
import { RootScreen } from "./src/screens";
import CarlitoBold from "./assets/fonts/Carlito-Bold.ttf";
import Ionicons from "./assets/fonts/Ionicons.ttf";
import MaterialIcons from "./assets/fonts/MaterialIcons.ttf";
import shirota from "./assets/fonts/shirota.otf";
import socketMiddleware from "./src/middlewares/socket";

ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);

enableScreens();

const store = createStore(
  combinedReducers,
  {},
  applyMiddleware(ReduxThunk, socketMiddleware)
);

YellowBox.ignoreWarnings(
  [
    "Require cycle:",
    "Please update",
    "Require cycles are allowed",
    "width was given a value of",
    "VirtualizedLists should never be nested",
  ]
);

const AppStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[ styles.statusBar, { backgroundColor } ]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);

const STATUSBAR_HEIGHT = StatusBar.currentHeight;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
});

export default class App extends Component {
  state = {
    isReady: false,
  };

  loadAsync = async () => {
    /*eslint-disable*/
    await Promise.all([
      Font.loadAsync({
        "Ionicons": Ionicons,
        "Material Icons": MaterialIcons,
        "MaterialIcons": MaterialIcons,
        "carlito-bold": CarlitoBold,
        "shirota": shirota
      }),
      Asset.loadAsync([
        require("./assets/camera.png"),
        require("./assets/cancel.png"),
        require("./assets/cart.png"),
        require("./assets/category-back.png"),
        require("./assets/chat.png"),
        require("./assets/coop-purchases-svg.png"),
        require("./assets/crowd.png"),
        require("./assets/download-arrow.png"),
        require("./assets/file.png"),
        require("./assets/info-button.png"),
        require("./assets/info.png"),
        require("./assets/newprofile.png"),
        require("./assets/noprice-svg.png"),
        require("./assets/not-available.png"),
        require("./assets/pricelist-svg.png"),
        require("./assets/profile-svg.png"),
        require("./assets/qr-code.png"),
        require("./assets/qr-code2.png"),
        require("./assets/question-mark.png"),
        require("./assets/save_icon.png"),
        require("./assets/shops-svg.png"),
        require("./assets/check-white.png"),
        require("./assets/notifications.png"),
        require("./assets/QR-focus-icon.png"),
        require("./assets/fingerprint.png"),
        require("./assets/icon.png"),
        require("./assets/focus1.png"),
        require("./assets/phone-icon.png"),
        require("./assets/phone-icon.filled.png"),
        require("./assets/dpd-logo.png"),
        require("./assets/manager-logo.png"),
        require("./assets/POI-logo.png"),
        require("./assets/rupost-logo.png"),
        require("./assets/photo-camera.png"),
        require("./assets/courier-logo.png"),
        require("./assets/sent-mail.png"),
        require("./assets/plus.png"),
        require("./assets/inbox.png")
      ])
    ]);
  };

  render() {
    const { isReady } = this.state;

    if (!isReady) {
      return (
        <AppLoading
          startAsync={this.loadAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      );
    }

    return (
      <Provider store={store}>
        {
          Platform.OS === "ios" ? (
            <AppStatusBar
              barStyle="dark-content"
            />
          )
          : null
        }
        <RootScreen />
      </Provider>
    );
  }
}
