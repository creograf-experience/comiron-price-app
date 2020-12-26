import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions
} from "react-native";

import { colors } from "../../constants";

import { PriceDetailHeader, IconButton } from "../../components";

import { strings } from "../../../locale/i18n";

const windowHeight = Dimensions.get('window').height;

const paymentTypes = [
  { id: 1, name: strings("paymentScreen.sber") },
  // { id: 2, name: strings("paymentScreen.courier") }
];

export class SelectPaymentScreen extends Component {
  render() {
    return(
      <View style={{ flex: 1, padding: 20 }}>
        {paymentTypes.map(type =>
          <TouchableOpacity
            key={type.id}
            style={{
              height: 60,
              marginBottom: 10,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
              paddingHorizontal: 20,
              borderRadius: 5
            }}
            onPress={() => {
              this.props.navigation.state.params.setDeliveryFields({
                paymentType: type.name
              });
              this.props.navigation.goBack();
            }}
          >
            <Text style={{ fontSize: 18, color: "gray" }}>{type.name}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

SelectPaymentScreen.navigationOptions = ({ navigation }) => ({
  headerStyle: {
    backgroundColor: colors.colorPrimary,
    height: 80,
  },

  headerTitle: () => (
    <PriceDetailHeader
      color="white"
      title={strings("paymentScreen.paymentMethod")}
      flag={"long"}
    />
  ),

  headerLeft: () => (
    <IconButton
      name={"ios-arrow-back"}
      stylesContainer={Platform.OS === "ios" ? styles.iosHeaderCenter : {}}
      stylesIcon={styles.arrowBack}
      onPress={() => navigation.goBack()}
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
