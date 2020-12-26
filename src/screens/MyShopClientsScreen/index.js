import React, { Component } from "react";
import { View, Platform, ScrollView, Dimensions } from "react-native";
import { connect } from "react-redux";

import { colors } from "../../constants";

import { strings } from "../../../locale/i18n";

import {
  Spinner,
  PriceDetailHeader,
  IconButton,
} from "../../components";

import ClientsRequests from "./components/ClientRequests";
import Clients from "./components/Clients";

const windowHeight = Dimensions.get('window').height;

class MyShopClientsScreen extends Component {
  render() {
    const { shop } = this.props.navigation.state.params;

    if (this.props.loading) return <Spinner />

    return(
      <ScrollView
        showsVerticalScrollIndicator={ false }
      >
        <ClientsRequests shopId={ shop.id } />
        <Clients shop={ shop } />
      </ScrollView>
    );
  }
}

MyShopClientsScreen.navigationOptions = ({ navigation }) => ({
  headerTitle: () => (
    <PriceDetailHeader
      title={strings("myClients.title")}
      color={colors.textColorPrimary}
    />
  ),

  headerLeft: () => (
    <IconButton
      name={ "ios-arrow-back" }
      stylesContainer={
        Platform.OS === "ios" ? {
          height: "100%",
          alignItems: "center",
          marginBottom: 5,
        }
        : {}
      }
      stylesIcon={{
        fontSize: 30,
        marginLeft: 25,
        marginTop: Platform.OS === "android" ? 20 : windowHeight > 667 ? 0 : 15,
        color: colors.textColorPrimary,
      }}
      onPress={ () => navigation.goBack() }
    />
  ),

  // невидимый элемент, чтобы выровнять
  // текст заголовка по центру
  headerRight: () => (
    <View style={{ marginRight: 15 }} />
  ),

  headerStyle: {
    backgroundColor: colors.colorPrimary,
    height: 80,
    // marginTop: Platform.OS === "ios" ? 20 : 0,
    shadowColor: "transparent",
    shadowRadius: 0,
    shadowOffset: {
      height: 0
    },
    elevation: 0,
    borderBottomWidth: 0,
  },
});

const mapStateToProps = state => ({
  loading: state.loading.loading
});
const connectedComp = connect(mapStateToProps, null)(MyShopClientsScreen);
export { connectedComp as MyShopClientsScreen };
