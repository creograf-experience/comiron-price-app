import React, { Component } from "react";
import {
  View,
  Platform,
  FlatList,
  RefreshControl,
  ScrollView,
  SectionList,
} from "react-native";

import { connect } from "react-redux";

import { fetchCarts, fetchCarts_SZ, getPricesNetworkRequest } from "../../networkers";

import { colors } from "../../constants";
import { strings } from "../../../locale/i18n";

import { getUserProfile } from "../../utils";

import { HeaderComponent, Spinner } from "../../components";
import { ContentWrapper } from "../MainScreen/components";
import { addCartLength, addCartSZ_Length, getPrices } from "../MainScreen/actions";
import Item from "./components/Item";
import CoopItem from "./components/CoopItem";
import NoCart from "./components/NoCart";
import { Separator } from "../MainScreen/components";

class CartScreen extends Component {
  state = {
    loading: true,
    refreshing: false,
    carts: [],
    carts_sz: [],
    userId: "",
    cartPrices: [],
  };

  render() {
    const { loading, refreshing, userId, prices } = this.state;
    let { carts, carts_sz } = this.state;

    if (carts == null) {
      carts = [];
    };

    if (loading) return <Spinner backgroundColor={colors.background}/>;

    if (!carts.length && !carts_sz.length) {
      return (
        <ScrollView
          style={{ backgroundColor: colors.background }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          <NoCart text={strings("cartScreen.noCart")} />
        </ScrollView>
      );
    };

    return (
      <ContentWrapper>
        <SectionList
          sections={[
            { data: carts, renderItem: ({ item }) => (
              <Item cart={item} onRefresh={this.onRefresh} />
            )},
            { data: carts_sz, renderItem: ({ item }) => (
              <CoopItem item={item} prices={prices} userId={userId} onRefresh={this.onRefresh} />
            )},
          ]}
          keyExtractor={(item, index) => String(index)}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onRefresh}
            />
          }
        />
          {/* <FlatList
            data={carts}
            renderItem={({ item }) => <Item cart={item} onRefresh={this.onRefresh} />}
            keyExtractor={(item, index) => String(index)}
            ItemSeparatorComponent={() => <Separator />}
          />
          <FlatList
            style={{ paddingTop: carts ? 15 : 0 }}
            data={carts_sz}
            renderItem={({ item }) => <CoopItem item={item} prices={prices} userId={userId} onRefresh={this.onRefresh} />}
            keyExtractor={(item, index) => String(index)}
            initialNumToRender={30}
            ItemSeparatorComponent={() => <Separator />}
          /> */}
      </ContentWrapper>
    );
  }

  async componentDidMount() {
    try {
      const user = await getUserProfile();
      const userId = user.split("~~")[0];

      await this.props.addCartLength();
      await this.props.addCartSZ_Length();

      const data = await fetchCarts();
      const data_sz = await fetchCarts_SZ();
      const response = await getPricesNetworkRequest(userId, 0);

      this.setState({
        loading: false,
        carts: data.cart,
        carts_sz: data_sz.carts,
        prices: response.prices,
      });
    } catch (err) {
      console.log("@CartScreen, componentDidMount: ", err);
      this.setState({ loading: false });
    }
  }

  onRefresh = async () => {
    try {
      this.setState({ refreshing: true });
      const user = await getUserProfile();
      const userId = user.split("~~")[0];

      await this.props.addCartLength();
      await this.props.addCartSZ_Length();

      const data = await fetchCarts();
      const data_sz = await fetchCarts_SZ();
      const response = await getPricesNetworkRequest(userId, 0);

      this.setState({
        refreshing: false,
        carts_sz: data_sz.carts,
        carts: data.cart,
        prices: response.prices,
      });
    } catch (err) {
      console.log("@CartScreen, onRefresh: ", err);
    }
  };
};

CartScreen.navigationOptions = () => ({
  headerStyle: {
    backgroundColor: colors.colorPrimary,
    height: 80,
    // marginTop: Platform.OS === "ios" ? 20 : 0
  },
  headerTitle: () => <HeaderComponent color="white" title={strings("cartScreen.title")} />
});

const mapStateToProps = state => ({
});

const mapDispatchToProps = {
  addCartLength,
  addCartSZ_Length,
};

const connectedCart = connect(mapStateToProps, mapDispatchToProps)(CartScreen);
export { connectedCart as CartScreen };

