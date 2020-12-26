import React, { Component } from "react";
import { FlatList, RefreshControl, StyleSheet, Dimensions } from "react-native";

import {
  fetchNotifications,
  getUserShopsNetworkRequest,
  getOrderDetailNetworkRequest,
  getShopInfoNetworkRequest,
} from "../../networkers";

import { colors } from "../../constants";

import { strings } from "../../../locale/i18n";

import { HeaderComponent, Spinner, IconButton } from "../../components";
import Item from "./components/Item";

const windowHeight = Dimensions.get('window').height;
class NotificationsScreen extends Component {
  state = {
    loading: true,
    refreshing: false,
    page: 0,
    notifications: [],
    userShopList: [],
    userShopDetailList: [],
    orders: [],
  };

  render() {
    const {
      loading,
      notifications,
      userShopList,
      refreshing,
      userShopDetailList,
      orders,
    } = this.state;

    if (loading) return <Spinner backgroundColor={colors.background} />;

    return (
      <FlatList
        data={notifications}
        renderItem={({ item }) =>
          <Item
            item={item}
            userShopDetailList={userShopDetailList}
            userShopList={userShopList}
          />
        }
        keyExtractor={item => String(item.id)}
        onEndReached={this.handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={this.onRefresh}
          />
        }
      />
    );
  }

  async componentDidMount() {
    try {
      const [notifications, userShops] = await Promise.all([
        fetchNotifications(this.state.page),
        getUserShopsNetworkRequest(),
      ]);
      const shops = await this.getShopDetailList(userShops.shops);

      this.setState({
        loading: false,
        notifications: notifications.pushes,
        userShopList: userShops.shops,
        page: this.state.page + 1,
        userShopDetailList: shops,
      });
    } catch (err) {
      console.log("@NotificationsScreen, componentDidMount: ", err);
      this.setState({ loading: false });
    }
  }

  getShopDetailList = async shops => {
    for (shop of shops) {
      const shopList = await getShopInfoNetworkRequest(shop.shop_id);
      return shopList.shop;
    }
  };

  handleLoadMore = async () => {
    try {
      const res = await fetchNotifications(this.state.page);

      if (!res.pushes) return;

      const shops = await this.getShopDetailList(this.state.userShopList);

      const updatedNotifications = [
        ...this.state.notifications,
        ...res.pushes,
      ];

      this.setState({
        notifications: updatedNotifications,
        page: this.state.page + 1,
        userShopDetailList: shops,
      });

    } catch (err) {
      console.log("@NotificationsScreen, handleLoadMore: ", err);
    }
  };

  onRefresh = async () => {
    try {
      await this.setState({ refreshing: true, page: 0 });

      const res = await fetchNotifications(this.state.page);
      const shops = await this.getShopDetailList(this.state.userShopList);

      this.setState({
        refreshing: false,
        page: this.state.page + 1,
        notifications: res.pushes,
        userShopDetailList: shops,
      });

    } catch (err) {
      console.log("@NotificationsScreen, onRefresh: ", err);
    }
  };
};

NotificationsScreen.navigationOptions = ({navigation}) => ({
  headerStyle: {
    backgroundColor: colors.colorPrimary,
    height: 80,
    // marginTop: Platform.OS==="ios" ? 20 : 0,
  },
  headerTitle: () => (<HeaderComponent color="white" title={strings("notificationScreen.title")} />),
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
  }
});

export { NotificationsScreen };
