import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  Dimensions,
  RefreshControl,
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import NoAddress from "./components/NoAddress";
import { colors, ADD_ADDRESS_SCREEN } from "../../constants";
import { getCartSiteNetworkRequest, deleteUserAddressRequest } from "../../networkers";

import { PriceDetailHeader, IconButton, Spinner } from "../../components";

import { strings } from "../../../locale/i18n";

const windowHeight = Dimensions.get('window').height;

export class SelectAddressScreen extends Component {
  state = {
    addresses: [],
    loading: false,
    refreshing: false,
  };

  render() {
    if (this.state.loading) {
      return <Spinner />
    }

    if (!this.state.addresses || !this.state.addresses.length) {
      return (
        <ScrollView
          style={{ backgroundColor: colors.background }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          <NoAddress text="Доступных адресов нет" />
        </ScrollView>
      )
    }

    return(
      <ScrollView contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 10,
        paddingVertical: 10
      }}>
        <View>
          {this.state.addresses.map(address =>
            <View
              key={address.id}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 10,
                paddingVertical: 10,
                paddingRight: 0,
                marginBottom: 10,
                backgroundColor: "white"
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  const { navigation } = this.props;
                  navigation.state.params.setUserAddress(address);
                  navigation.goBack();
                }}
                style={{ width: "85%" }}
              >
                <Text style={styles.regular}>
                  {address.addrstring}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ paddingHorizontal: 20, paddingVertical: 10, paddingRight: 10 }}
                onPress={() =>this.showDeleteAlert(address.id)}
              >
                <Ionicons name="ios-trash" style={styles.trashcan} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }

  async componentDidMount() {
    try {
      const { shop } = this.props.navigation.state.params;
      this.setState({ loading: true });
      const res = await getCartSiteNetworkRequest(shop.id);
      this.props.navigation.setParams({ addAddress: this.addAddress });
      this.setState({ addresses: res.addresses, loading: false });

    } catch (err) {
      console.warn(err);
      this.setState({ loading: false });
    }
  }


  handleDeleteAddress = async id => {
    try {
      this.setState({ loading: true });
      await deleteUserAddressRequest(id);
      this.setState({
        addresses: this.state.addresses.filter(addr => addr.id !== id),
        loading: false
      });
    } catch (err) {
      console.warn(err);
      this.setState({ loading: false });
      Alert.alert(
        strings("sberbankScreen.error"),
        strings("adressScreen.errorDescription"),
        [{ text: "Ок", style: "cancel" }]
      )
    }
  }

  onRefresh = async () => {
    try {
      const { shop } = this.props.navigation.state.params;
      this.setState({ refreshing: true });
      const res = await getCartSiteNetworkRequest(shop.id);
      this.props.navigation.setParams({ addAddress: this.addAddress });
      this.setState({ addresses: res.addresses, refreshing: false });

    } catch (err) {
      console.warn(err);
      this.setState({ refreshing: false });
    }
  }

  showDeleteAlert = id => {
    Alert.alert(
      strings("adressScreen.deleteWarning"),
      strings("adressScreen.deleteQuestion"),
      [
        {
          text: strings("adressScreen.cancel"),
          style: "cancel",
        },
        {
          text: strings("profile.yes"),
          onPress: () => this.handleDeleteAddress(id)
        },
      ],
      { cancelable: false },
    );
  }

  addAddress = address => this.setState({
    addresses: this.state.addresses ? [...this.state.addresses, address] : [address]
  });
}

SelectAddressScreen.navigationOptions = ({ navigation }) => ({
  headerStyle: {
    backgroundColor: colors.colorPrimary,
    height: 80,
  },

  headerTitle: () => (
    <PriceDetailHeader
      color="white"
      title={strings("adressScreen.adressChoice")}
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
  ),

  headerRight: () => (
    <IconButton
      name={"ios-add-circle-outline"}
      stylesContainer={[ Platform.OS === "ios" ? styles.iosHeaderCenter : {marginRight: 20, padding: 5} ]}
      stylesIcon={styles.iconList}
      onPress={() => navigation.navigate(ADD_ADDRESS_SCREEN, {
        addAddress: navigation.state.params.addAddress
      })}
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

  iconList : {
    fontSize: 30,
    marginRight: 10,
    color: "#fff",
    marginTop: Platform.OS === "android" ? 18 : windowHeight > 667 ? 0 : 15,
  },

  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5
  },

  bold: { fontWeight: "bold" },

  regular: { fontSize: 15 },

  trashcan: {
    fontSize: 24,
    color: colors.colorPrimary,
  }
})
