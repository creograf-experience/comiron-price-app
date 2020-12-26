import React, { PureComponent } from "react";
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  AsyncStorage,
  TouchableHighlight,
  Alert,
  RefreshControl,
  Dimensions,
} from "react-native";
import * as MailComposer from "expo-mail-composer";
import Modal from "react-native-modal";

import { getUserToken, getUserRefreshToken } from "../../utils";
import {
  colors,
  hostImages,
  PRICE_DETAIL_SCREEN,
  SHOP_SEARCH_RESULT_SCREEN,
  GROUP_SCREEN,
  BAR_CODE_SCANNER_SCREEN,
  CHOOSE_STAFF_SHOPS_CHAT_SCREEN,
} from "../../constants";
import { ContactInfoWrapper, ShopInfoTopText, NoPrice, NoShop } from "./components";
import { scale, verticalScale } from "react-native-size-matters";
import {
  HeaderRightButton,
  GroupPrice,
  Price,
  PriceDetailHeader,
  Spinner,
  IconButton,
  DefaultSearchBar,
} from "../../components";
import { ContentWrapper } from "../MainScreen/components";
import { Button } from "../../containers";
import { Separator } from "../MainScreen/components";
import { strings } from "../../../locale/i18n";
import { productSearchRequest, fetchUserShop, getUserShopsNetworkRequest, getShopInfoNetworkRequest } from "../../networkers";
import { SwitchButtons } from "./containers";

const windowHeight = Dimensions.get('window').height;

export class ShopInfoScreen extends PureComponent {
  state = {
    loading1: true,
    loading2: true,
    loading3: true,
    refreshing: false,
    following: false,
    prices: [],
    groups: [],
    pricesList: null,
    phone: strings("shopInfoScreen.phoneUnknown"),
    email: strings("shopInfoScreen.emailUnknown"),
    shop_info: this.props.navigation.state.params.shop,
    allShops: this.props.navigation.state.params.allShops,
    userShopList: this.props.navigation.state.params.userShopList,
    shop: null,
    userID: null,
    token: "",
    refreshToken: "",
    isVisible: false,
    searchInput: "",
    groupFlag: true,
    priceFlag: false,
    products_num: "0",
    orders_num: "0",
    clients_num: "0",
    fromShop: this.props.navigation.state.params.fromShop,
    fromRecShops: this.props.navigation.state.params.fromRecShops,
  };

  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;

    return {
      headerTitle: () => (
        <PriceDetailHeader
          title={state.params.shop ? state.params.shop.name : ""}
          color={colors.textColorPrimary}
        />
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
      headerTintColor: colors.textColorPrimary,
      headerLeft: () => (
        <IconButton
          name={"ios-arrow-back"}
          stylesContainer={Platform.OS === "ios" ? styles.iosHeaderCenter : {}}
          stylesIcon={styles.arrowBack}
          onPress={() => { navigation.state.params.scanned
            ? navigation.navigate(BAR_CODE_SCANNER_SCREEN, { scanned: false })
            : navigation.goBack()}}
        />
      ),
      headerRight: () => (
        <HeaderRightButton navigation={navigation} isBackgroundWhite={true} />
      )
    };
  };

  // componentDidUpdate(prevProps) {
  //   if (prevProps.groups.length === this.props.groups.length) {
  //     if (this.props.fetching) {
  //       return;
  //     }

  //     if (this.props.error) {
  //       alert(this.props.error);
  //     }

  //     if (this.props.groups) {
  //       this.setState({
  //         groups: this.props.groups,
  //         loading3: false,
  //         loading1: false,
  //       });
  //     }

  //     if (this.props.shop != null) {
  //       this.setState({
  //         shop: this.props.shop,
  //         loading2: false,
  //       });
  //     }

  //     if (this.props.status.status === "OK") {
  //       if (this.state.shop_info.add2client !== "options_add_2_friend_req") {
  //         this.setState({
  //           following: !this.state.following,
  //         });
  //       }
  //     }
  //   }
  // }

  componentWillReceiveProps(nextProps) {
    if (nextProps.fetching) {
      return;
    }

    if (nextProps.error) {
      alert(nextProps.error);
    }

    if (nextProps.groups) {
      this.setState({
        groups: nextProps.groups,
        loading3: false,
      });
    }

    if (nextProps.status === "got") {
      if (nextProps.prices.prices) {
        let prices = this.state.prices;

        prices = prices.concat(nextProps.prices.prices);

        this.setState({
          prices: prices,
          pricesList: nextProps.prices.prices,
          loading1: false,
        });

        if (this.state.i === 1) {
          this.getAllPrices(nextProps.prices.pages);
        }
      } else {
        this.setState({ loading1: false });
      }
    }

    if (nextProps.shop != null) {
      this.setState({
        shop: nextProps.shop,
        loading2: false,
      });
    }

    if (nextProps.status.status === "OK") {
      if (this.state.shop_info.add2client !== "options_add_2_friend_req") {
        this.setState({
          following: !this.state.following,
        });
      }
    }
  }

  async componentDidMount() {
    const { shop_info, allShops, userShopList } = this.state;
    if (!shop_info) return;
    this.props.clearGroups();

    const response = await getShopInfoNetworkRequest(shop_info.shop_id ? shop_info.shop_id : shop_info.id);
    this.setState({
      clients_num: response.shop.clients_num,
      products_num: response.shop.products_num,
      orders_num: response.shop.orders_num.total,
    });

    const shops = await getUserShopsNetworkRequest();
    shops.shops.map(shop => {
      if (shop.shop_id == shop_info.shop_id || shop.shop_id == shop_info.id) {
        this.setState({ following: true });
      }
    });

    await this.props.getShopInfo(allShops ? shop_info.id : shop_info.shop_id);
    userShopList.map(shop => {
      if (
        allShops &&
        (shop_info.id === shop.shop_id || shop_info.shop_id === shop.shop_id)
      ) {
        this.setState({
          following: true,
        });
      }
    });

    this.getToken();
    this.getUserId();
  }

  getAllPrices = count => {
    const { userID, allShops, shop_info } = this.state;
    const { getShopPrices } = this.props;

    for (let i = 2; i <= count; i++) {
      getShopPrices(
        allShops ? shop_info.id : shop_info.shop_id,
        i,
        parseInt(userID)
      );
    }
    this.setState({
      i: count,
    });
  };

  getToken = async () => {
    const token = await getUserToken();
    const refreshToken = await getUserRefreshToken();

    this.setState({
      token,
      refreshToken,
    });
  };

  getUserId = async () => {
    const { getShopPrices } = this.props;
    const { shop_info, allShops } = this.state;
    let userID = "";
    try {
      userID = await AsyncStorage.getItem("comironUserProfile");
    } catch (error) {
      // Error retrieving data
    }

    getShopPrices(
      allShops ? shop_info.id : shop_info.shop_id,
      1,
      parseInt(userID)
    );

    this.setState({
      userID,
      i: 1,
    });
  };

  showModal = () => this.setState({ isVisible: true });

  hideModal = () => this.setState({ isVisible: false });

  addShop = () => {
    const { shop_info, token, refreshToken, isVisible } = this.state;
    const { addClient } = this.props;

    if (shop_info.add2client === "options_add_2_friend_req" && !isVisible) {
      this.showModal();
    } else {
      addClient(
        parseInt(shop_info.id ? shop_info.id : shop_info.shop_id),
        token,
        refreshToken
      );
    }

    if (isVisible) {
      addClient(
        parseInt(shop_info.id ? shop_info.id : shop_info.shop_id),
        token,
        refreshToken
      );
      this.setState({ following: true });
      this.hideModal();
    }
  };

  deleteShop = () => {
    const { shop_info, token, refreshToken } = this.state;
    const { deleteShop } = this.props;

    deleteShop(
      parseInt(shop_info.id ? shop_info.id : shop_info.shop_id),
      token,
      refreshToken
    );

    if (this.state.fromShop) {
      this.setState({ following: false });
    } else if (this.state.fromRecShops) {
      this.setState({ following: false });
    } else {
      this.setState({ following: false });
    };

    // if (shop_info.add2client === "options_add_2_friend_req") {
    //   this.setState({ following: false });
    // }
  };

  renderItem = ({ item }) => {
    return (
      <TouchableHighlight
        activeOpacity={0.4}
        underlayColor="#44454a"
        onPress={() => {
          const price = this.props.allPrices.find(el => el.id === item.id);
          if (!price) {
            this.props.addPrice(item);
          }
          this.props.navigation.navigate(PRICE_DETAIL_SCREEN, {
            personId: parseInt(this.state.userID),
            priceId: item.id,
            shopId: item.id_shop,
            title: item.name,
            saved: item.saved,
            fromShop: true,
            userShopList: this.state.userShopList,
            allShops: this.state.allShops,
            shop: this.state.shop_info,
            isClick: this.props.isClick,
          });
        }}
      >
        <View>
          <Price
            name={item.name}
            date={item.date}
            shop={item.shop}
            isViewed={true}
            numOrders={item.num_orders}
          />
        </View>
      </TouchableHighlight>
    )
  };

  renderGroupItem = ({ item }) => {
    return (
      <TouchableHighlight
        activeOpacity={0.4}
        underlayColor="#44454a"
        onPress={() => {
          this.props.navigation.navigate(GROUP_SCREEN, {
            personId: parseInt(this.state.userID),
            shopId: item.shop_id,
            title: item.name,
            fromShop: true,
            saved: this.props.navigation.state.params.saved,
            userShopList: this.state.userShopList,
            allShops: this.state.allShops,
            shop: this.state.shop_info,
            isClick:this.props.isClick,
            groupId: item.id,
            subs: item.subs,
          });
        }}
      >
        <View>
          <GroupPrice
            name={item.name}
            isViewed={true}
          />
        </View>
      </TouchableHighlight>
    );
  };

  onGetShopInfo = () => {
    const { shop_info, allShops } = this.state;
    this.props.getShopInfo(allShops ? shop_info.id : shop_info.shop_id);
    this.setState({ refreshing: false });
  };

  onRefresh = async () => {
    const { shop_info, allShops } = this.state;
    await this.setState({ refreshing: true });
    await this.props.renewShopList(allShops ? shop_info.id : shop_info.shop_id);
    this.setState({ refreshing: false });
  };

  takeNumber = txt => {
    if (txt.length >= 11) {
      txt = txt.replace(/[^0-9]/g, "");
      if ( (txt[0] === "7" || txt[0] === "8") && txt.length === 11) {
        return `+7${txt.slice(1, 11)}`;
      }
      else {
        if (txt[0] === "8" && txt.length === 13) {
          return `+86${txt.slice(2, 13)}`;
        } else {
          return `+86${txt.slice(0, 11)}`;
        }
      }
    }
    return txt.replace(/[^0-9]/g, "");
  };

  openEmail = email => {
    MailComposer.composeAsync({
      recipients: [email]
    });
  };

  callManager = async () => {
    const shopId = this.state.shop.shop.id;
    const personId = parseInt(this.state.userID);
    const person = {
      shop_id: shopId,
      person_id: personId,
    }
    await this.props.callManager(person);
    Alert.alert(strings("shopInfoScreen.appSent"), strings("shopInfoScreen.managerContact"), [
      { text: strings("priceDetail.ok") }
    ]);
  };

  onSearch = async () => {
    const { shop, searchInput, userID } = this.state;

    if (!this.state.searchInput.length) return;

    this.setState({ loading1: true });

    const res = await productSearchRequest(
      shop.shop.id,
      searchInput.match(/[-/!()@\|~$]+/g) ? searchInput.replace(/[-/!()@\|~$]+/g, "") : searchInput
    );

    let data = { products: [], groups: [] };
    if (res.products.length) {
      data = res.products[0];
      delete data.shop;
    }
    this.setState({ loading1: false });

    const { navigation } = this.props;
    return navigation.navigate(SHOP_SEARCH_RESULT_SCREEN, {
      title: navigation.state.params.shop.name,
      products: data.products,
      groups: data.groups === null ? [] : Object.values(data.groups),
      properties: data.productproperties,
      isClick: this.props.isClick,
      shopId: shop.shop.id,
      personId: parseInt(userID),
      nextpage: res.nextpage,
      searchInput: searchInput,
      currency: shop.shop.currency,
      isControSklad: shop.shop.iscontrolsklad,
      shop: shop.shop,
    });
  };

  onSwitchGroupFlag = () => {
    this.setState({
      groupFlag: true,
      priceFlag: false,
    });
  };

  onSwitchPriceFlag = () => {
    this.setState({
      priceFlag: true,
      groupFlag: false,
    });
  };

  render() {
    const {
      loading1,
      loading2,
      loading3,
      shop_info,
      shop,
      groups,
      prices,
      refreshing,
      isVisible,
      groupFlag,
      priceFlag,
      products_num,
      orders_num,
      clients_num,
    } = this.state;
    let { following } = this.state;

    if (!shop_info) {
      return (
        <NoShop text={strings("shopInfoScreen.noShop")} />
      );
    }
    if (shop_info.clients && shop_info.clients.hasOwnProperty(parseInt(this.state.userID))) following = true;

    let phone = strings("shopInfoScreen.noNumber");
    let email = strings("shopInfoScreen.noEmail");

    if (!loading2) {
      if (shop.shop && shop.shop.shop_phone_numbers && shop.shop.shop_phone_numbers.length !== 0) {
        phone = shop.shop.shop_phone_numbers[0].phone_number;
      }
      if (shop.shop && shop.shop.shop_emails && shop.shop.shop_emails.length !== 0) {
        email = shop.shop.shop_emails[0].email;
      }
    }

    return loading1 || loading2 || loading3 ? (
      <Spinner style={{ flex: 1 }} />
    ) : (
      <View
        style={{
          flex: 1,
          width: "100%",
          alignItems: "center",
          backgroundColor: colors.background,
          position: "absolute",
          zIndex: 1,
          height: "100%",
        }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            height: scale(85),
            backgroundColor: colors.colorPrimary,
            alignItems: "flex-start",
            paddingLeft: scale(5),
            zIndex: 1,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onGetShopInfo}
            />
          }
        >
          <View
            style={{
              shadowColor: "#000",
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.3,
              shadowRadius: 3,
              elevation: 10,
              marginRight:5
            }}
          >
            <Image
              style={{
                height: scale(100),
                width: scale(100),
                borderRadius: scale(55),
              }}
              source={{ uri: `${hostImages}${shop_info.thumbnail_url}` }}
            />
          </View>
          <View style={styles.shopStatStyle}>
            <Text style={styles.shopStatTextStyle}>
              {clients_num}
              {'\n'}
              {strings("shopInfoScreen.clients_num")}
            </Text>
            <Text style={styles.shopStatTextStyle}>
              {products_num}
              {'\n'}
              {strings("shopInfoScreen.products_num")}
            </Text>
            <Text style={styles.shopStatTextStyle}>
              {orders_num}
              {'\n'}
              {strings("shopInfoScreen.orders_num")}
            </Text>
          </View>
        </View>
        <ContactInfoWrapper
          style={{
            marginTop: scale(10),
            width: "100%",
            zIndex: 0,
          }}
        >
          <View
            style={{
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            {/* <Text style={{ padding: 5 }}>
              Компания галеон трейд - это 900 квадртаных метров новых современных складских помещений класса А, 2000 метров офисов, выставочных и торговых залов
            </Text> */}
            <TouchableOpacity
                disabled={phone === strings("shopInfoScreen.noNumber")}
                onPress={() => {
                  Linking.openURL(`tel:${this.takeNumber(phone)}`);
                }}
              >
                <ShopInfoTopText style={{ color: "black", padding: 5 }}>
                  {
                    phone === strings("shopInfoScreen.noNumber")
                      ? ""
                      : this.takeNumber(phone)
                  }
                </ShopInfoTopText>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={email === strings("shopInfoScreen.noEmail")}
                onPress={() => {
                  this.openEmail(email);
                }}
              >
                <ShopInfoTopText style={{ color: "black", fontSize: 14, padding: 5 }}>
                  {
                    email === strings("shopInfoScreen.noEmail")
                      ? ""
                      : email
                  }
                </ShopInfoTopText>
              </TouchableOpacity>
            <Modal
              style={styles.modal}
              useNativeDriver
              isVisible={isVisible}
            >
              <View
                style={{
                  flexDirection: "row",
                  paddingHorizontal: scale(20),
                  flex: 1,
                  height: "100%",
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    justifyContent: "flex-start",
                    alignSelf: "flex-start",
                    marginTop: verticalScale(20),
                    flex: 2,
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  {strings("shopInfoScreen.sendSub")}
                </Text>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    style={{
                      width: scale(50),
                      height: scale(50),
                      borderRadius: scale(25),
                      backgroundColor: "white",
                      alignSelf: "flex-end",
                      shadowColor: "#000",
                      shadowOffset: {width: 0, height: 2},
                      shadowOpacity: 0.3,
                      shadowRadius: 3,
                      marginTop: scale(-25),
                      justifyContent: "center",
                      alignItems: "center",
                      elevation: 10,
                    }}
                    onPress={this.hideModal}
                  >
                    <Image
                      style={{ width: scale(30), height: scale(30) }}
                      source={require("../../../assets/cancel.png")}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                  alignItems: "center",
                  width: "100%",
                }}
              >
              {
                following ? (
                  <Button
                    text={strings("shopInfoScreen.unSub")}
                    onPress={this.deleteShop}
                    style={{ width: "50%" }}
                    fontSize="12"
                    type="custom"
                    outlined={false}
                    texted={true}
                    color="black"
                  />
                )
                : (
                  <Button
                    text={strings("shopInfoScreen.sub")}
                    onPress={this.addShop}
                    style={{ width: "50%" }}
                    fontSize="12"
                    type="custom"
                    outlined={true}
                    texted={false}
                    color={colors.inStockColor}
                  />
                )
              }
              </View>
            </Modal>
          </View>

        </ContactInfoWrapper>

        <View style={styles.shopInfoStyle}>
          <View style={{ marginLeft: 40 }}>
            <Button
              fontSize="12"
              type="custom"
              outlined={false}
              texted={true}
              color="white"
              text={following ? strings("shopInfoScreen.unSub") : strings("shopInfoScreen.sub")}
              onPress={following ? this.deleteShop : this.addShop}
            />
          </View>

          <View style={{ marginLeft: 75 }}>
            <Button
              fontSize="12"
              type="custom"
              outlined={false}
              texted={true}
              color="white"
              text={strings("shopInfoScreen.chat")}
              onPress={() => { this.props.navigation.navigate(CHOOSE_STAFF_SHOPS_CHAT_SCREEN, {
                shop: this.state.shop.shop,
                shopId: this.state.shop.shop.id,
                title: this.props.navigation.state.params.shop.name
              })}}
            />
          </View>

        </View>

        <SwitchButtons
          onPressGroup={() => this.onSwitchGroupFlag()}
          onPressPrice={() => this.onSwitchPriceFlag()}
          groupFlag={groupFlag}
          priceFlag={priceFlag}
        />

        <View style={{ width: "100%" }}>
          <DefaultSearchBar
            placeholderText={strings("shopsScreen.searchItemShop")}
            value={this.state.searchInput}
            onClear={() => this.setState({ searchInput: "" })}
            onChangeText={text => this.setState({ searchInput: text })}
            onEndEditing={this.onSearch}
          />
        </View>
        {
          groupFlag && groups.length ?
            <FlatList
              style={{ flex: 1, width: "100%" }}
              data={groups}
              renderItem={this.renderGroupItem}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={() => <Separator />}
              ListFooterComponent={<View style={{ paddingBottom: 10 }} />}
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          : priceFlag && prices.length ?
            <FlatList
              style={{ flex: 1, width: "100%" }}
              data={prices}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={() => <Separator />}
              ListFooterComponent={<View style={{ paddingBottom: 10 }} />}
            />
          : <View style={{ flex: 1, width: "100%" }}>
              <ContentWrapper
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <NoPrice text={strings("main.noGroup")} />
              </ContentWrapper>
            </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  arrowBack: {
    fontSize: 30,
    marginLeft: 25,
    color: colors.textColorPrimary,
    marginTop: Platform.OS === "android" ? 20 : windowHeight > 667 ? 0 : 15,
  },
  iosHeaderCenter: {
    height: "100%",
    alignItems: "center",
    marginBottom: 5,
  },
  modal: {
    margin: 0,
    backgroundColor: "white",
    height: "50%",
    flex: 0,
    bottom: 0,
    position: "absolute",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: verticalScale(40),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  buttonCallManager:{
    borderWidth: 1,
    borderColor: colors.inStockColor,
    color: colors.colorPrimary,
    backgroundColor: colors.background,
    fontWeight: "bold",
    fontSize: 12,
    padding: 5,
    justifyContent: "center",
    alignSelf: "center",
  },
  shopStatStyle: {
    flexDirection: "row",
    paddingLeft: 10,
    marginTop: 25,
  },
  shopStatTextStyle: {
    textAlign: "center",
    paddingRight: 10,
    color: "white",
    fontWeight: "600",
  },
  shopInfoStyle: {
    flex: Platform.OS == "ios" ? 0.20 : 0.30,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.colorPrimary,
    borderTopWidth: 1,
    borderTopColor: colors.colorPrimary,
    backgroundColor: colors.colorPrimary,
    width: "100%",
  },
});

export default ShopInfoScreen;
