import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity
} from "react-native";

import { colors } from "../../constants";

import { Button } from "../../containers";
import { PriceDetailHeader, IconButton } from "../../components";
import {
  CourierInfo,
  RussiaPostInfo,
  DpdInfo,
  PoiInfo
} from "./components";

import { strings } from "../../../locale/i18n";

import dpdLogo from "../../../assets/dpd-logo.png"
import rupostLogo from "../../../assets/rupost-logo.png"
import courierLogo from "../../../assets/courier-logo.png"
import managerLogo from "../../../assets/manager-logo.png"
import POILogo from "../../../assets/POI-logo.png"

const windowHeight = Dimensions.get('window').height;

const deliveries = [
  {
    id: "dpd",
    image: dpdLogo
  },
  {
    id: "russiapost",
    image: rupostLogo
  },
  {
    id: "kurer",
    image: courierLogo
  },
  {
    id: "manager",
    image: managerLogo
  },
  {
    id: "pointofissue",
    image: POILogo
  }
];

// @TODO: Filter allowed shop delivery types

export class SelectDeliveryScreen extends Component {
  state = {
    deliveryType: "",

    // courier
    courierCity: ""
    // rupost
  };

  render() {
    const { shop } = this.props.navigation.state.params;

    const allowedDeliveries = new Map([
      ["kurer", shop.deliverycourier],
      ["dpd", shop.deliverydpdru],
      ["manager", shop.deliverymanager],
      ["pointofissue", shop.deliverypointofissue],
      ["russiapost", shop.deliveryrupost]
    ]);

    let filteredDeliveries = deliveries.reduce((acc, item) => {
      if (!allowedDeliveries.get(item.id)) return acc;
      return [...acc, item];
    }, []);

    return(
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.deliveryTypesContainer}>
          {filteredDeliveries.map(delivery =>
            <TouchableOpacity
              key={delivery.id}
              style={styles.deliveryTypesItem(this.state.deliveryType, delivery.id)}
              onPress={() => {
                if (this.state.deliveryType === delivery.id) {
                  this.resetState();
                  return;
                }

                this.resetState({ except: ["deliveryType"] });
                this.setState({ deliveryType: delivery.id })
              }}
            >
              <Image source={delivery.image} />
            </TouchableOpacity>
          )}
        </View>

        <View style={{ flex: 1 }}>
          {this.renderDeliveryInfo()}
        </View>
      </ScrollView>
    );
  }

  resetState = ({ except } = { except: [] }) => {
    const emptyState = Object.keys(this.state).reduce((acc, key) => {
      if (except.includes(key)) return acc;
      return { ...acc, [`${key}`]: "" };
    }, {});

    this.setState(emptyState);
  }

  renderDeliveryInfo = () => {
    switch (this.state.deliveryType) {
      case "manager":
        return this.renderManagerInfo();

      case "kurer":
        return <CourierInfo
          setDeliveryFields={this.setDeliveryFields}
          shop={this.props.navigation.state.params.shop}
          courierCity={this.state.courierCity}
          setCourierCity={city => this.setState({ courierCity: city })}
          userCity={
            this.props.navigation.state.params.userAddress &&
            this.props.navigation.state.params.userAddress.city
          }
        />

      case "russiapost":
        return <RussiaPostInfo
          setDeliveryFields={this.setDeliveryFields}
          shop={this.props.navigation.state.params.shop}
          userPostalCode={
            this.props.navigation.state.params.userAddress &&
            this.props.navigation.state.params.userAddress.postalcode
          }
        />

      case "dpd":
        return <DpdInfo
          setDeliveryFields={this.setDeliveryFields}
          shop={this.props.navigation.state.params.shop}
          userAddress={this.props.navigation.state.params.userAddress}
        />

      case "pointofissue":
        return <PoiInfo
          setDeliveryFields={this.setDeliveryFields}
          shop={this.props.navigation.state.params.shop}
        />

      default:
        return(
          <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
            <Text style={[{ textAlign: "center" }, styles.regular]}>
              {strings("deliveryScreen.deliveryChoice")}
            </Text>
          </View>
        );
    }
  }

  renderManagerInfo = () => {
    return(
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <Text style={[{ textAlign: "center" }, styles.regular]}>
          {strings("deliveryScreen.manager")}
        </Text>

        <View style={{ width: "45%", marginTop: 20 }}>
          <Button
            text={strings("deliveryScreen.continue")}
            onPress={() => {
              this.props.navigation.state.params.setDeliveryFields({ deliveryType: this.state.deliveryType });
              this.props.navigation.goBack();
            }}
          />
        </View>
      </View>
    );
  }

  setDeliveryFields = fields => {
    this.props.navigation.state.params.setDeliveryFields({
      deliveryType: this.state.deliveryType,
      ...fields
    });
    this.props.navigation.goBack();
  }
}

SelectDeliveryScreen.navigationOptions = ({ navigation }) => ({
  headerStyle: {
    backgroundColor: colors.colorPrimary,
    height: 80,
  },

  headerTitle: () => (
    <PriceDetailHeader
      color="white"
      title={strings("deliveryScreen.deliveryMethods")}
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

  container: {
    flexGrow: 1,
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 10
  },

  deliveryTypesContainer: {
    flex: 0,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 10
  },

  deliveryTypesItem: (selected, delivery) => ({
    marginBottom: 10,
    marginRight: 5,
    borderWidth: selected === delivery ? 2 : 0,
    borderColor: colors.colorPrimary,
    borderRadius: 5,
  })
})
