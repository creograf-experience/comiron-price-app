import React, { PureComponent } from "react";
import {
  FlatList,
  TouchableHighlight,
  StyleSheet,
  Platform,
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";

import { Image as PreviewImage } from "react-native-expo-image-cache";

import {
  Spinner,
  IconButton,
  PriceDetailHeader,
} from "../../components";
import { ContentWrapper, Separator, NoPrice, Price } from "./components";
import { colors, ALL_ORDER_DETAIL_SCREEN, hostImages } from "../../constants";
import { getUserToken, getUserRefreshToken } from "../../utils";
import { strings } from "../../../locale/i18n";

const windowHeight = Dimensions.get('window').height;

class AllOrderScreen extends PureComponent {
  state = {
    refreshing: false,
    page: 0,
    token: "",
    refreshToken: "",
  };

  handleLoadMore = () => {
    this.setState({ page: this.state.page + 1 }, this.onGetOrders);
  };

  async componentDidMount() {
    const { getAllOrder } = this.props;
    const token = await getUserToken();
    const refreshToken = await getUserRefreshToken();
    this.setState({ token, refreshToken });
    if (this.props.order.length === 0) {
      await getAllOrder(token, refreshToken, 0);
    };
  }

  onGetOrders = () => {
    this.props.getAllOrder(this.state.token, this.state.refreshToken, this.state.page);
    this.setState({ refreshing: false });
  };

  onRefresh = async () => {
    await this.setState({ page: 0, refreshing: true });
    await this.props.renewGetAllOrder(this.state.token, this.state.refreshToken, this.state.page);
    this.setState({ refreshing: false });
  };

  renderItem = ({ item }) => {
    const detailSum = item.details.find(el => el.sum);
    return (
      <TouchableOpacity
        activeOpacity={0.4}
        underlayColor="#44454a"
        onPress={() => {
          this.props.navigation.navigate(ALL_ORDER_DETAIL_SCREEN, {
            numberOrder: item.id,
            shopId: item.shop_id,
            title: item.shop_name,
            date: item.dataorder * 1000,
            thumbnail_url: item.thumbnail_url,
            sum: item.sum,
            numberPosition: item.num,
            token: this.state.token,
            refreshToken: this.state.refreshToken,
            isClick: this.props.isClick,
            currency: item.currency,
            status: item.status,
            comment_shop: item.comment_shop,
            details: item.details,
            deliverystate: item.deliverystate,
            delivery: item.delivery,
            is_sz: item.is_sz,
            item: item,
          });
        }}
      >
        <View>
          <Price
            name={item.shop_name}
            date={item.dataorder * 1000}
            shop={item.shop_id}
            thumbnail_url={item.thumbnail_url}
            numberOrder={item.id}
            sum={item.sum}
            numberPosition={item.num}
            currencyName={item.currency !== null ? item.currency.name : "₽"}
            status={item.status}
            comment_shop={item.comment_shop}
            flag={false}
            is_sz={item.is_sz}
            item={item}
            deliverystate={item.deliverystate}
            delivery={item.delivery}
          />
        </View>
        <View style={{ backgroundColor: "white" }}>
          <FlatList
            data={item.details}
            keyExtractor={el => el.id}
            horizontal
            renderItem={this.renderPhotos}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </TouchableOpacity>
    );
  };

  renderPhotos = ({ item }) => {
    const preview = `${hostImages}${item.photo_url}`;
    const uri = `${hostImages}${item.photo_url}`;
    // <Image style={{ width: 40, height: 40, borderRadius: 20 }} source={{ uri: `${hostImages}${item.photo_url}`/* , cache: "force-cache" */}}/>
    return (
      <View style={{ marginLeft: 30, paddingBottom: 10 }}>
        <PreviewImage style={{ width: 40, height: 40, borderRadius: 20 }} uri={uri} preview={{ uri: preview }} />
      </View>
    );
  };

  render() {
    const { order, loading } = this.props;

    if (!order.length && loading) {
      return <Spinner backgroundColor={colors.background}/>;
    };

    if (!order.length && !loading) {
      return (
        <ContentWrapper>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onGetOrders}
              />
            }
          >
            <NoPrice text={strings("allOrderScreen.messageOrderNo")} />
          </ScrollView>
        </ContentWrapper>
      );
    };

    return (
      <ContentWrapper>
        <FlatList
          style={{ paddingTop: 5 }}
          data={order}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <Separator />}
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
          initialNumToRender={20}
          onEndReachedThreshold={0.5}
          onEndReached={this.handleLoadMore}
          ListFooterComponent={<View style={{ paddingBottom: 25 }}/>}
        />
      </ContentWrapper>
    );
  }
}

AllOrderScreen.navigationOptions = ({ navigation }) => ({
  headerStyle: {
    backgroundColor: colors.colorPrimary,
    height: 80,
    // marginTop: Platform.OS === "ios" ? 20 : 0,
  },
  headerTitle: () => <PriceDetailHeader color="white" title={strings('allOrderScreen.orders')} />,
  headerLeft: () => (
    <IconButton
      name={"ios-arrow-back"}
      stylesContainer={Platform.OS === "ios" ? styles.iosHeaderCenter : {}}
      stylesIcon={styles.arrowBack}
      onPress={() => navigation.goBack()}
    />
  ),
  // невидимый элемент, чтобы выровнять
  // текст заголовка по центру
  headerRight: () => (
    <View style={{ marginRight: 15 }} />
  ),
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
  },
});

export default AllOrderScreen;
