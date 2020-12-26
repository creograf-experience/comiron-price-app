import React, { Component } from "react";
import {
  ScrollView,
  FlatList,
  View,
  StyleSheet,
  Text,
  TextInput,
  Platform,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  Dimensions,
  UIManager,
  KeyboardAvoidingView,
} from "react-native";
import _ from "lodash";

import {
  CoopPrice,
  CoopTimerPrice,
  Spinner,
  IconButton,
  PriceDetailHeader,
  InStock,
  PriceInfo,
  ProductContent,
  CartContainer,
  CartTextInputContainer,
  CommentTextInputContainer,
  CoopSum,
  Sum,
  CoopNumOrdersProduct,
} from "../../../components";
import {
  ContentWrapper,
  TouchProduct,
  ProductImage,
  Separator,
} from "../../OrderDetailScreen/components";
import {
  hostImages,
  COOP_PRICE_DETAIL_SCREEN,
  colors,
  CART_SCREEN,
  ORDER_DETAIL_SECOND_SCREEN,
} from "../../../constants";

import { getCartSZ_SiteNetworkRequest } from "../../../networkers";

import {
  getDayMonthYear,
  getTimeUntilEnddate,
  getUserToken,
  getUserRefreshToken,
} from "../../../utils";

import { strings } from "../../../../locale/i18n";

const { State: TextInputState } = TextInput;

const windowHeight = Dimensions.get('window').height;

import notAvailable from "../../../../assets/not-available.png";

export default class CoopOrderDetailScreen extends Component {
  constructor(props) {
    super();
    this.state = {
      products: props.navigation.state.params.cart,
      selected: props.navigation.state.params.selected,
      enddate: props.navigation.state.params.enddate,
      shopId: props.navigation.state.params.shopId,
      priceId: props.navigation.state.params.priceId,
      prices: props.navigation.state.params.prices,
      shift: new Animated.Value(0),
      comment: "",
      currencyId: props.navigation.state.params.currencyId,
      loading2: false,
      loadingOnMount: false,
    };
  }

  async componentDidMount() {
    const { shopId, priceId } = this.state;

    this.setState({ loadingOnMount: true });

    const selected = [];
    const token = await getUserToken();
    const refreshToken = await getUserRefreshToken();

    await this.props.getCart_SZ(shopId, priceId, token, refreshToken);

    const productFilter = this.state.products.map(product => product.id);
    const productFiltered = this.props.cartSZ_Site.filter(product => !productFilter.includes(String(product.id)));

    this.setState({ products: productFiltered });
    this.state.products.forEach(el => {
      if (el.cartCount && el.shop_id === this.state.shopId) selected.push(el.id);
    });
    this.setState({ selected });

    await this.props.addCartSZ_Length();

    this.setState({ loadingOnMount: false });
  }

  componentDidUpdate(prevProps, prevState) {
    const { navigation } = this.props;

    if (prevState.selected.length !== 0 && this.state.selected.length === 0) {
      navigation.goBack();
    };
  }

  componentWillMount() {
    this.keyboardDidShowSub = Keyboard.addListener(
      "keyboardDidShow",
      this.handleKeyboardDidShow
    );
    this.keyboardDidHideSub = Keyboard.addListener(
      "keyboardDidHide",
      this.handleKeyboardDidHide
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
  }

  handleKeyboardDidShow = event => {
    const { height: windowHeight } = Dimensions.get("window");
    const keyboardHeight = event.endCoordinates.height;
    const currentlyFocusedField = TextInputState.currentlyFocusedField();
    UIManager.measure(
      currentlyFocusedField,
      (originX, originY, width, height, pageX, pageY) => {
        const fieldHeight = height;
        const fieldTop = pageY;
        const gap =
          windowHeight - keyboardHeight - (fieldTop + fieldHeight) - 10;
        if (!gap || gap >= 0) {
          return;
        }
        Animated.timing(this.state.shift, {
          toValue: gap,
          duration: 250,
          useNativeDriver: true,
        }).start();
        this.setState({ keyboardIsShown: true });
      }
    );
  };

  handleKeyboardDidHide = () => {
    Animated.timing(this.state.shift, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
    this.setState({ keyboardIsShown: false });
  };

  changeCartCount = async (value, item) => {
    const { shopId, priceId } = this.state;
    const { navigation } = this.props;

    const token = await getUserToken();
    const refreshToken = await getUserRefreshToken();

    if (+value > +item.sklad) {
      item.cartCount = item.sklad;
      return;
    }

    if (navigation.state.params.changeCartCount) {
      await navigation.state.params.changeCartCount(value, item);
      value === "0" ? this.setState({ selected: _.without(this.state.selected, item.id) }): null;
    }

    if (value === "0") {
      const res = await getCartSZ_SiteNetworkRequest(shopId, priceId, token, refreshToken);
      if (res.cart) {
        const cart = res.cart;
        const cartProduct = cart.find(el => el.product.id === item.id);
        if (cartProduct) {
          await this.props.deleteItemSZ_Site(cartProduct.id, token, refreshToken);
          await this.props.addCartSZ_Length();
          !navigation.state.params.fromSZ ? navigation.state.params.onCartRefresh() : null;
        } else null;
        this.setState({ selected: _.without(this.state.selected, item.id) });
      }
      return;
    }

    if (+item.box) {
      if (+value < +item.package && +value < +item.package) {
        item.cartCount = item.package;
      }

      if (+value < +item.cartCount) {
        item.cartCount = `${+item.cartCount - +item.package}`;
      }

      if (+value > +item.cartCount && +value % +item.cartCount === 0) {
        item.cartCount = value;
      }

      if (+value > +item.cartCount) {
        item.cartCount = `${+item.cartCount + +item.package}`;
      }
    }
    item.cartCount = value;
    this.replaceProduct(item);
  };

  changeCartCountRazmerme = (value, item) => {
    if (+item.cartCount + 1 > +item.sklad) {
      item.cartCount = item.sklad;
      return;
    }

    if (this.state.isControlSklad === "0" || +item.sklad >= +item.cartCount) {
      if (+item.razmerme) {
        item.cartCount = String(Math.ceil(item.cartCount / item.razmerme) * item.razmerme);
        if (item.cartCount === "0") {
          item.cartCount = "";
        }
      }
    }
    else {
      Alert.alert(strings("priceDetail.noCountItem"), "", [
        { text: strings("priceDetail.ok")}
      ]);
      item.cartCount = +item.razmerme ? +item.razmerme : "1";
    }
    item.cartCount = +item.razmerme ? `${(+item.cartCount).toFixed(1)}` : `${+item.cartCount}`;
    
    if (item.inputColor) {
      if (+item.sklad >= +item.cartCount) {
        delete item.inputColor;
      }
    }
    this.setState({ product: item });
    this.replaceProduct(item);
  };

  incrementCartCount = item => {
    if (this.props.navigation.state.params.incrementCartCount) {
      this.props.navigation.state.params.incrementCartCount(item);
    } else {
      const val = +item.box ? "1" : "1";
      const valkr = +item.razmerme ? item.razmerme : val;
      const value = +item.razmerme ? `${(+item.cartCount + +valkr).toFixed(1)}` : `${(+item.cartCount + +valkr)}`;

      if (+value > +item.sklad) return;

      if (this.state.isControlSklad === "0" || +item.sklad >= value) {
        item.cartCount = value;
        this.replaceProduct(item);
      } else {
        Alert.alert(strings("priceDetail.noCountItem"), "", [
          { text: strings("priceDetail.ok")}
        ]);
      }
    }
    this.setState({ product: item });
  };

  decrementCartCount = async item => {
    const { shopId, priceId } = this.state;
    const { navigation } = this.props;

    const token = await getUserToken();
    const refreshToken = await getUserRefreshToken();

    // if (navigation.state.params.decrementCartCount) {
    //   await navigation.state.params.decrementCartCount(item);
    //   !item.cartCount ? this.setState({ selected: _.without(this.state.selected, item.id) }) : null;
    // } else {
      const val = +item.box ? "1" : "1";
      const valkr = +item.razmerme ? item.razmerme : val;

      const value = +item.razmerme ? `${(+item.cartCount - +valkr).toFixed(1)}` : `${(+item.cartCount - +valkr)}`;
      item.cartCount = value;
    // }

    if (+item.cartCount == 0 || item.cartCount === undefined) {
      +item.cartCount < 0 ? item.cartCount == "0" : null;
      delete item.cartCount;
      const res = await getCartSZ_SiteNetworkRequest(shopId, priceId, token, refreshToken);
      if (res.cart) {
        const cart = res.cart;
        const cartProduct = cart.find(el => el.product.id === item.id);
        if (cartProduct) {
          await this.props.deleteItemSZ_Site(cartProduct.id, token, refreshToken);
          await this.props.addCartSZ_Length();
          navigation.state.params.fromSZ ? navigation.state.params.forCartDeleteProduct(item) : null;
          !navigation.state.params.fromSZ ? navigation.state.params.onCartRefresh() : null;
        } else null;
        this.setState({ selected: _.without(this.state.selected, item.id) });
      }
      return;
    }

    if (item.inputColor) {
      if (+item.sklad >= +item.cartCount) {
        delete item.inputColor;
      }
    }
    this.setState({ product: item });
    this.replaceProduct(item);
  };

  replaceProduct = async (item) => {
    const { products, enddate } = this.state;

    const token = await getUserToken();
    const refreshToken = await getUserRefreshToken();

    const cartShop = products.filter(el => el.cartCount);
    const addCartSite = cartShop.map(el => ({
      id: +el.id,
      num: +el.cartCount,
      price_id: +el.price_id,
      source: "price",
      is_sz: 1,
      enddate: enddate,
    }));
    
    for (el of addCartSite) {
      el.id == item.id
      ? await this.props.setItemSZ_CountSite(el.id, el.num, el.price_id, el.source, el.is_sz, el.enddate, token, refreshToken)
      : null;
    }

    this.setState({ product: item });
  };

  getSum = () => {
    const { products, selected } = this.state;

    const filterProducts = products.filter(product =>
      selected.some(select => select === product.id)
    );
    const sum = filterProducts.reduce(
      (sum, item) => sum + Number(item.cartCount) * item.price,
      0
    );

    return sum;
  };

  sendOrder = async () => {
    const { navigation } = this.props;
    const { prices } = this.state;

    const token = await getUserToken();
    const refreshToken = await getUserRefreshToken();

    const price = prices.find(price => price.id == navigation.state.params.priceId);

    const { day, month, year } = getDayMonthYear(+price.enddate);
    const { milliseconds } = getTimeUntilEnddate(+price.enddate);

    this.setState({ loading: true });

    if (milliseconds <= 0) {
      return (
        Alert.alert(
          strings("priceDetail.orderErr"),
          `${strings("coopScreen.orderNotSent")} ${day}.${month}.${year}`,
          [
            {
              text: strings("priceDetail.ok"),
              onPress: () => navigation.goBack()
            }
          ]
        ),
        this.setState({ loading2: false })
      );
    }

    const price_id = navigation.state.params.priceId;
    const shop_id = navigation.state.params.shopId;
    const order = {
      shop_id,
      price_id,
    };
    await this.props.OrderSZ_Send(order, token, refreshToken);
    await this.props.addCartSZ_Length();
    this.setState({ loading2: false });
    Alert.alert(strings("priceDetail.orderComplete"), "", [
      { text: strings("priceDetail.ok"), onPress: () => {
        if (navigation.state.params.fromSZ) {
          navigation.state.params.onSelectedClear();
          navigation.navigate(COOP_PRICE_DETAIL_SCREEN);
        } else {
          navigation.state.params.onCartRefresh();
          navigation.navigate(CART_SCREEN);
        };
      }}
    ]);

    this.state.selected = [];
  };

  saveOrder = () => {
    const { prices } = this.state;
    const { navigation } = this.props;

    const price = prices.find(price => price.id == navigation.state.params.priceId);

    this.props.navigation.navigate(ORDER_DETAIL_SECOND_SCREEN, {
      products: this.state.products,
      selected: this.state.selected,
      shift: new Animated.Value(0),
      phone: "",
      comment: "",
      shopId: this.state.shopId,
      price_id: this.state.priceId,
      currencyId: this.state.currencyId,
      isControlSklad: price.shop.iscontrolsklad,
      loading2: false,
      phoneRequire: price.shop.isphonerequired,
      noPhone: false,
      shop: price.shop,
      fromSZ: navigation.state.params.fromSZ,
      onSelectedClear: navigation.state.params.onSelectedClear,
      is_sz: price.is_sz,
      onCartRefresh: navigation.state.params.onCartRefresh,
    });
  };

  renderCart = item => {
    if (item.hasOwnProperty("cartCount")) {
      return (
        <CartContainer>
          <TouchableWithoutFeedback
            hitSlop={{ left: 0, top: 0, right: 0, bottom: 0 }}
            onPress={() => this[`textInput${item.id}`].focus()}
          >
            <CartTextInputContainer>
              <TextInput
                ref={input => (this[`textInput${item.id}`] = input)}
                defaultValue={item.cartCount}
                onChangeText={value => this.changeCartCount(value, item)}
                keyboardType="numeric"
                style={{ fontSize: 18, fontWeight: "bold" }}
                returnKeyType="done"
                onBlur={value => this.changeCartCountRazmerme(value, item)}
              />
            </CartTextInputContainer>
          </TouchableWithoutFeedback>

          <View style={{ marginLeft: 15, marginRight: 10 }}>
            <IconButton
              name={"ios-add-circle-outline"}
              stylesContainer={{ marginTop: 10, marginBottom: 5 }}
              stylesIcon={{ fontSize: 30, color: colors.dataColor }}
              onPress={() => this.incrementCartCount(item)}
              hitSlop={{ left: 0, top: 0, right: 0, bottom: 0 }}
            />

            <IconButton
              name={"ios-remove-circle-outline"}
              stylesContainer={{ marginBottom: 10, marginTop: 10 }}
              stylesIcon={{ fontSize: 30, color: colors.dataColor }}
              onPress={() => this.decrementCartCount(item)}
              hitSlop={{ left: 0, top: 0, right: 0, bottom: 0 }}
            />
          </View>
        </CartContainer>
      );
    }
  };

  renderItem = ({ item }) => {
    const { numOrdersProducts } = this.props;

    const isOrderedEarlier = numOrdersProducts.some(el => el.id === item.id);
    const numOrder = isOrderedEarlier
      ? numOrdersProducts.find(el => el.id === item.id)
      : null;
    const num = isOrderedEarlier ? numOrder.numOrders : null;

    return (
      <View style={[ styles.itemContainer, { shadowOffset: {width: 5, height: 0} } ]}>
        <View style={styles.product}>
          <TouchProduct>
            {this.renderImage(item)}
            <ProductContent>
              <Text style={{ fontSize:16 }}>{item.name}</Text>

              <Text style={{ fontSize: 18, fontWeight: "700" }}>{item.price} {item.currency.name}</Text>

              {Boolean(+item.box) && (
                <Text>{strings("priceDetail.avaibleBox")}{item.box}</Text>
              )}
              {
                item.num_orders_sz ? 
                  <CoopNumOrdersProduct
                    tobuy={item.tobuy}
                    num_orders_sz={item.num_orders_sz}
                  />
                : null
              }
            </ProductContent>
          </TouchProduct>
          {this.renderCart(item)}
          </View>
          <View style={styles.codeAndStockContainer}>
              {item.code ? <Text style={styles.codeAndStockText}>{strings("priceDetail.codeItem")}{item.code}</Text> : null}
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.codeAndStockText}>{strings("priceDetail.avaible")}</Text>
                <InStock value={+item.sklad} unit={item.edizm} />
              </View>
          </View>
      </View>
    );
  };

  renderImage = item => {
    if (item.thumbnail_url) {
      return (
        <ProductImage source={{ uri: `${hostImages}${item.thumbnail_url}` }} />
      );
    }

    return <ProductImage source={notAvailable} />;
  };

  renderProducts = () => {
    const { products, selected, showAll, shift, prices } = this.state;
    // const { prices } = this.props;

    const filterProducts = products.filter(product =>
      selected.some(select => select === product.id)
    );
    const priceId = this.props.navigation.state.params.priceId;
    const price = prices.find(price => price.id === priceId);

    const {
      milliseconds,
      daysLeft,
    } = getTimeUntilEnddate(+price.enddate);
    return (
      <Animated.View
        style={[
          { flex: 1, height: "100%" },
          { transform: [{ translateY: shift }] }
        ]}
      >
        <PriceInfo>
        {
          daysLeft > 0 ? (
            <CoopPrice name={price.name} date={price.enddate} shop={price.shop} isViewed={true}/>
          ) : milliseconds < 0 ? (
            <CoopPrice name={price.name} date={price.enddate} shop={price.shop} isViewed={true}/>
          ) : (
            <CoopTimerPrice name={price.name} date={price.enddate} shop={price.shop} isViewed={true}/>
          )
        }
        </PriceInfo>
        
        <FlatList
          style={{ paddingTop: 5 }}
          data={showAll ? products : filterProducts}
          extraData={selected}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <Separator />}
          ListFooterComponent={<View style={{ paddingBottom: 10 }} />}
        />
      </Animated.View>
    );
  };

  renderOrder = () => {
    const { comment, prices } = this.state;
    const { navigation } = this.props;

    const price = prices.find(price => price.id == navigation.state.params.priceId);

    return (
      <View>
        {/* <Text style={styles.commentText}>{strings("priceDetail.comment")}</Text>
        <CommentTextInputContainer>
          <TextInput
            style={{ height: 100 }}
            multiline
            fontSize={16}
            onChangeText={comment => this.setState({ comment })}
            value={comment}
            blurOnSubmit
          />
        </CommentTextInputContainer> */}
        <CoopSum currencyId={this.state.currencyId} value={this.getSum()} enddate={price.enddate} sendOrder={this.saveOrder} />
      </View>
    );
  };

  render() {
    const { loading } = this.props;
    const { loading2, loadingOnMount, enddate } = this.state;
    const { daysLeft } = getTimeUntilEnddate(+enddate);

    if (loading || loading2 || loadingOnMount) {
      return <Spinner />;
    }

    return (
      <ContentWrapper>
        {this.renderProducts()}
        <KeyboardAvoidingView behavior="padding" enabled>
          {
            daysLeft + 3 < 0
            ? null 
            : this.renderOrder()
          }
        </KeyboardAvoidingView>
      </ContentWrapper>
    );
  }
}

CoopOrderDetailScreen.navigationOptions = ({ navigation }) => ({
  headerTitle: () => <PriceDetailHeader title={strings("priceDetail.regOrder")} />,
  headerStyle: {
    backgroundColor: colors.textColorPrimary,
    height: 80,
    // marginTop: Platform.OS === "ios" ? 20 : 0,
    // color: "black",
  },
  headerLeft: () => (
    <IconButton
      name={"ios-arrow-back"}
      stylesContainer={Platform.OS === "ios" ? styles.iosHeaderCenter : {}}
      stylesIcon={styles.arrowBack}
      onPress={() => navigation.goBack()}
    />
  ),
});

const styles = StyleSheet.create({
  arrowBack: {
    fontSize: 30,
    marginLeft: 25,
    color: "#8a8c9c",
    marginTop: Platform.OS === "android" ? 20 : windowHeight > 667 ? 0 : 15,
  },
  iosHeaderCenter: {
    height: "100%",
    alignItems: "center",
    marginBottom: 5,
  },
  product: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    position: "relative",
  },
  buttons: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  commentText: {
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 5,
    fontSize: 14,
  },
  itemContainer: {
    backgroundColor: "white",
    shadowColor: "rgba(0, 0, 0, 0.05)",
    shadowRadius: 5,
    shadowOpacity: 1,
  },
  itemContainerFull: {
    backgroundColor: "rgba(0, 128, 0, 0.05)",
    shadowColor: "rgba(0, 0, 0, 0.05)",
    shadowRadius: 5,
    shadowOpacity: 1,
  },
  codeAndStockContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 20,
    marginBottom: 10,
    marginRight: 20,
    borderTopWidth: 1,
    borderTopColor: colors.background,
  },
  codeAndStockText: {
    fontSize: 14,
    color: colors.dataColor,
    paddingTop: 5,
  },
});
