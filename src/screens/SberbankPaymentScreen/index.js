import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Platform,
  Alert,
  Dimensions
} from "react-native";
import { WebView } from "react-native-webview";

import { colors, CART_SCREEN } from "../../constants";

import { PriceDetailHeader, IconButton } from "../../components";

import { strings } from "../../../locale/i18n";

const windowHeight = Dimensions.get('window').height;

export class SberbankPaymentScreen extends Component {
  state = { url: "" };

  componentDidMount() {
    const { newOrder } = this.props.navigation.state.params;
    let url = "https://comironserver.comiron.com/shop/cart_send/" + newOrder.shop_id;
    const params = new URLSearchParams();

    for (const key of Object.keys(newOrder)) {
      params.append(key, newOrder[key]);
    }

    url = url + "?" + params.toString();
    this.setState({ url });
  }

  render() {
    return(
      <View style={{ flex: 1 }}>
        <WebView
          ref = {webview => { this.webViewRef = webview; }}
          source={{ uri: this.state.url }}
          onNavigationStateChange={this.handleWebViewNavigationStateChange}
        />
      </View>
    );
  }

  handleWebViewNavigationStateChange = newNavState => {
    const { url } = newNavState;
    if (!url) return;

    if (url.includes("?sb_ok")) {
      this.webViewRef.stopLoading();
      this.props.navigation.navigate(CART_SCREEN);
      return;
    }

    if (url.includes("?sb_fail")) {
      this.webViewRef.stopLoading();
      Alert.alert(
        strings("sberbankScreen.error"),
        strings("sberbankScreen.errorDescription"),
        [
          {
            text: 'Ок',
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );

      this.props.navigation.navigate(CART_SCREEN);
      return;
    }
  }
}

SberbankPaymentScreen.navigationOptions = ({ navigation }) => ({
  headerStyle: {
    backgroundColor: colors.colorPrimary,
    height: 80,
  },

  headerTitle: () => (
    <PriceDetailHeader
      color="white"
      title={strings("cartScreen.payment")}
      flag={"long"}
    />
  ),

  headerLeft: () => (
    <IconButton
      name={"ios-arrow-back"}
      stylesContainer={Platform.OS === "ios" ? styles.iosHeaderCenter : {}}
      stylesIcon={styles.arrowBack}
      onPress={() => navigation.navigate(CART_SCREEN)}
    />
  )
});

const styles = StyleSheet.create({
  arrowBack: {
    fontSize: 30,
    marginLeft: 25,
    color: "#fff",
    marginTop: Platform.OS === "android" ? 20 : windowHeight > 667 ? 0 : 15,
  },

  iosHeaderCenter: {
    height: "100%",
    alignItems: "center",
    marginBottom: 5,
    marginRight: 15,
  },

  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5
  },

  bold: { fontWeight: "bold" },

  regular: { fontSize: 15 },
})
