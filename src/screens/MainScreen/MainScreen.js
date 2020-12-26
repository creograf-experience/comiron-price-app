import React, { PureComponent } from "react";
import {
  FlatList,
  TouchableHighlight,
  StyleSheet,
  Platform,
  View,
  Text,
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from "react-native";

import { Notifications } from 'expo';

import {
  Spinner,
  PriceDetailHeader,
  HeaderLeftButton,
  HeaderRightButton,
  Container,
} from "../../components";
import { ContentWrapper, Separator, NoPrice, Price, Photo, CoopMainPrice } from "./components";
import {
  PRICE_DETAIL_SCREEN,
  colors,
  SHOP_INFO_SCREEN,
  COOP_PRICE_DETAIL_SCREEN,
} from "../../constants";

import { getUserProfile, getViewedPrices, setViewedPrices } from "../../utils";
import { strings } from "../../../locale/i18n";

import { executeRequest } from '../../utils';

class MainScreen extends PureComponent {
  state = {
    userId: "",
    refreshing: false,
    page: 1,
    userShopList: [],
    loadingOnMount: false,
  };

  handleLoadMore = () => {
    this.setState({ page: this.state.page + 1 }, this.onGetPrices);
  };

  async componentDidMount() {
    const {
      getPrices,
      getUserProfileRequest,
      getUserProfileSuccess,
      addCartLength,
      addCartSZ_Length,
    } = this.props;

    this.setState({ loadingOnMount: true });

    await addCartLength();
    await addCartSZ_Length();
    getUserProfileRequest();
    const user = await getUserProfile();
    const userId = user.split("~~")[0];

    await getUserProfileSuccess();
    await getPrices(userId, this.state.page);
    this.setState({ userId });
    await this.getViewedPrices();

    this.setState({ loadingOnMount: false });

    this.notificationSubscription = Notifications.addListener(this.handleNotification);
  }

  handleNotification = async notification => {
    try {
      const { data, origin } = notification;
      const { navigation, prices } = this.props;

      console.log(origin);
      console.log(data);

      if (origin !== "selected" || data.type !== "price") return;

      const existingPrice = prices.find(price => price.id == data.price_id);
      if (existingPrice) {
        await this.setViewed(data.price_id);
        navigation.navigate(PRICE_DETAIL_SCREEN, {
          personId: this.state.userId,
          priceId: data.price_id,
          shopId: data.shop_id,
          title: data.name,
        });

        return;
      }

      const [price, shop] = await Promise.all([
        executeRequest({
          method: 'GET',
          url: `price/pricedetail/?shop=${data.shop_id}&price=${data.price_id}&user_id=${this.state.userId}`
        }),
        executeRequest({
          method: 'GET',
          url: `shop/${data.shop_id}`
        })
      ]);

      console.log('price ', price);
      console.log('shop ', shop);

      delete shop.shop.clients;
      delete shop.shop.cart;
      delete shop.shop.currency;

      const newPrice = {
        id: price.data.price_id,
        id_shop: price.data.id_shop,
        date: price.data.date,
        name: price.data.name,
        descr: price.data.descr,
        shop: shop.shop,
      };

      this.props.addPrice(newPrice);

      await this.setViewed(data.price_id);
      navigation.navigate(PRICE_DETAIL_SCREEN, {
        personId: this.state.userId,
        priceId: data.price_id,
        shopId: data.shop_id,
        title: data.name,
      });

    } catch (err) {
      console.log(err);
      Alert.alert(
        strings("priceDetail.orderErr"),
        strings("priceDetail.errPrice"),
        [
          { text: strings("priceDetail.ok"), onPress: () => {}, style: "cancel" }
        ]
      );
    }
  };

  getViewedPrices = async () => {
    const viewed = await getViewedPrices();
    if (viewed) {
      const viewedPrices = viewed.split(" ");
      this.props.setViewedPrices({ viewedPrices });
    }
  };

  setViewed = async price => {
    if (this.props.viewedPrices.length === 0) {
      await setViewedPrices(price);
      this.props.setViewedPrices({ viewedPrices: [price] });
      return;
    }
    const viewed = this.props.viewedPrices.join(" ");

    this.props.setViewedPrices({
      viewedPrices: this.props.viewedPrices.concat(price)
    });

    await setViewedPrices(`${viewed} ${price}`);
  };

  onGetPrices = () => {
    this.props.getPrices(this.state.userId, this.state.page);
    this.setState({ refreshing: false });
  };

  onRefresh = async () => {
    await this.setState({ page: 1, refreshing: true });
    await this.props.renewPriceList(this.state.userId, this.state.page);
    await this.props.addCartLength();
    await this.props.addCartSZ_Length();
    this.setState({ refreshing: false });
  };

  renderItem = ({ item }) => {
    const isViewed = this.props.viewedPrices.some(el => el === item.id);
    return (
      <TouchableHighlight
        activeOpacity={0.4}
        underlayColor="#44454a"
          onPress={async () => {
            await this.setViewed(item.id);
            item.is_sz == 0 ? (
              this.props.navigation.navigate(PRICE_DETAIL_SCREEN, {
                personId: this.state.userId,
                priceId: item.id,
                shopId: item.id_shop,
                title: item.name,
                saved: item.saved,
                fromShop: false,
                isClick: this.props.isClick,
              })
            ) : (
              this.props.navigation.navigate(COOP_PRICE_DETAIL_SCREEN, {
                personId: this.state.userId,
                priceId: item.id,
                shopId: item.id_shop,
                title: item.name,
                saved: item.saved,
                fromShop: false,
                isClick: this.props.isClick,
              })
            )
          }}
        >
        <Container
          style={{
            shadowOffset: {width: 5, height: 0},
            shadowColor: "rgba(0,0,0,0.05)",
            shadowRadius: 5,
            shadowOpacity: 1,
          }}
          isViewed={isViewed}
        >
        {
          item.is_sz == 0 ? (
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate(SHOP_INFO_SCREEN, {
                  userShopList: this.state.userShopList,
                  shop: item.shop,
                  allShops: !this.state.userShopList.includes(item.shop),
                  fromPrice: true,
                });
              }}
            >
              <Photo shop={item.shop}/>
            </TouchableOpacity>
          ) : (
            <View style={styles.triangleCorner} >
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate(SHOP_INFO_SCREEN, {
                    userShopList: this.state.userShopList,
                    shop: item.shop,
                    allShops: !this.state.userShopList.includes(item.shop),
                    fromPrice: true,
                  });
                }}
              >
                <Photo shop={item.shop}/>
              </TouchableOpacity>
            </View>
          )
        }
        {
          item.is_sz == 0 ? (
            <Price
              name={item.name}
              date={item.date}
              shop={item.shop}
              numOrders={item.num_orders}
            />
          ) : (
            <CoopMainPrice
              name={item.name}
              date={item.enddate}
              shop={item.shop}
              isViewed={isViewed}
              numOrders={item.num_orders}
            />
          )
        }
        </Container>
      </TouchableHighlight>
    );
  };

  render() {
    const { prices, loading } = this.props;
    const { loadingOnMount } = this.state;

    if (!prices.length && loading || loadingOnMount) {
      return <Spinner backgroundColor={colors.background}/>;
    }

    if (!prices.length && !loading) {
      return (
        <ContentWrapper>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onGetPrices}
              />
            }
          >
            <NoPrice text={strings("main.noPrice")} />
            <Text style={{ fontSize: 14, color: colors.dataColor, marginRight: 20, marginLeft: 30 }}>
              {strings("main.supMessage")}
            </Text>
          </ScrollView>
        </ContentWrapper>
      );
    }

    return (
      <ContentWrapper>
        <FlatList
          style={{ paddingTop: 5 }}
          data={prices}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <Separator />}
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
          initialNumToRender={30}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={<View style={{ paddingBottom: 10 }}/>}
        />
      </ContentWrapper>
    );
  }
}

const styles = StyleSheet.create({
  triangleCorner: {
    flexDirection: "column",
    alignSelf: "flex-start",
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderRightWidth: 25,
    borderTopWidth: 25,
    borderRightColor: "transparent",
    borderTopColor: colors.colorPrimary,
  },
});

MainScreen.navigationOptions = ({ navigation }) => ({
  headerStyle: {
    backgroundColor: colors.colorPrimary,
    height: 80,
    // marginTop: Platform.OS === "ios" ? 20 : 0
  },
  headerTitle: () => <PriceDetailHeader color="white" title={strings("main.priceList")} />,
  headerLeft: () => <HeaderLeftButton navigation={navigation} isBackgroundWhite={true} />,
  headerRight: () => <HeaderRightButton navigation={navigation} />
});

export default MainScreen;
