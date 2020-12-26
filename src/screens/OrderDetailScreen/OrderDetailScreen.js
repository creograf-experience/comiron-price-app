import React, { Component } from "react";
import {
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
} from "react-native";

import _ from "lodash";

import {
  Spinner,
  IconButton,
  PriceDetailHeader,
  InStock,
  ProductContent,
  CartContainer,
  CartTextInputContainer,
  ConfirmSum,
  NumOrdersProduct,
  GroupDetailPrice,
  PriceInfo,
} from "../../components";
import {
  ContentWrapper,
  TouchProduct,
  ProductImage,
  Separator,
} from "./components";
import {
  hostImages,
  colors,
  ORDER_DETAIL_SECOND_SCREEN,
} from "../../constants";

const { State: TextInputState } = TextInput;

const windowHeight = Dimensions.get('window').height;

import { getCartSiteNetworkRequest } from "../../networkers";
import notAvailable from "../../../assets/not-available.png";
import { strings } from "../../../locale/i18n";
import { getUserToken, getUserRefreshToken } from "../../utils";

export default class OrderDetailScreen extends Component {
  constructor(props) {
    super();
    this.state = {
      products: props.navigation.state.params.cart,
      selected: [],
      shift: new Animated.Value(0),
      phoneNumber: "",
      comment: "",
      shopId: props.navigation.state.params.shopId,
      shop: props.navigation.state.params.shop,
      price_id: props.navigation.state.params.priceId,
      currencyId: props.navigation.state.params.currencyId,
      isControlSklad: props.navigation.state.params.isControlSklad,
      loading2: false,
      shopInfo: props.navigation.state.params.shopInfo,
      flag: props.navigation.state.params.flag,
      phoneRequire: props.navigation.state.params.phoneRequire,
      noPhone: false,
      saved: props.navigation.state.params.saved,
    };
  }
  async componentDidMount() {
    const { shopId } = this.state;
    const selected = [];

    this.setState({ loading2: true });

    const token = await getUserToken();
    const refreshToken = await getUserRefreshToken();

    await this.props.getCart(shopId, token, refreshToken);

    const productFilter = this.state.products.map(product => product.id);
    const productFiltered = this.props.cartSite.filter(product => !productFilter.includes(String(product.id)));
    const newCart = productFiltered.concat(this.state.products);
    this.setState({ products: productFiltered });

    this.state.products.forEach(el => {
      if (el.cartCount && el.shop_id === this.state.shopId) selected.push(el.id);
    });
    this.setState({ selected });

    await this.props.addCartLength();
    
    this.keyboardDidShowSub = Keyboard.addListener(
      "keyboardDidShow",
      this.handleKeyboardDidShow
    );
    this.keyboardDidHideSub = Keyboard.addListener(
      "keyboardDidHide",
      this.handleKeyboardDidHide
    );

    this.setState({ token, refreshToken, loading2: false });
  }

  componentDidUpdate(prevProps, prevState) {
    const { navigation } = this.props;

    if (prevState.selected.length !== 0 && this.state.selected.length === 0) {
      navigation.goBack();
    };
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
        const gap = windowHeight - keyboardHeight - (fieldTop + fieldHeight);
        if (!gap || gap >= 0) {
          return;
        };
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
    const { shopId } = this.state;
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
      const res = await getCartSiteNetworkRequest(shopId, token, refreshToken);
      if (res.cart) {
        const cart = res.cart.cart;
        const cartProduct = cart.find(el => el.product.id === item.id);
        if (cartProduct) {
          await this.props.deleteItemSite(cartProduct.id, token, refreshToken);
          await this.props.addCartLength();
          !navigation.state.params.fromPrice ? navigation.state.params.onCartRefresh() : null;
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

  changeCartCountRazmerme = (item) => {
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
    const { shopId } = this.state;
    const { navigation } = this.props;

    const token = await getUserToken();
    const refreshToken = await getUserRefreshToken();

    // if (this.props.navigation.state.params.decrementCartCount) {
    //   await this.props.navigation.state.params.decrementCartCount(item);
    //   !item.cartCount ? this.setState({ selected: _.without(this.state.selected, item.id) }) : null;
    // } else {
      const val = +item.box ? "1" : "1";
      const valkr = +item.razmerme ? item.razmerme : val;

      const value = +item.razmerme ? `${(+item.cartCount - +valkr).toFixed(1)}` : `${(+item.cartCount - +valkr)}`;
      item.cartCount = value;
    // }

    if (item.inputColor) {
      if (+item.sklad >= +item.cartCount) {
        delete item.inputColor;
      }
    }
    this.setState({ product: item });
    this.replaceProduct(item);

    if (+item.cartCount == 0 || item.cartCount === undefined) {
      +item.cartCount < 0 ? item.cartCount == "0" : null;
      delete item.cartCount;
      // item.cartCount = "0";
      const res = await getCartSiteNetworkRequest(shopId, token, refreshToken);
      if (res.cart) {
        const cart = res.cart.cart;
        const cartProduct = cart.find(el => el.product.id === item.id);
        if (cartProduct) {
          await this.props.deleteItemSite(cartProduct.id, token, refreshToken);
          await this.props.addCartLength();
          navigation.state.params.fromPrice ? navigation.state.params.forCartDeleteProduct(item) : null;
          !navigation.state.params.fromPrice ? navigation.state.params.onCartRefresh() : null;
        } else null;
        this.setState({ selected: _.without(this.state.selected, item.id) });
      }
      return;
    }
  };

  replaceProduct = async (item) => {
    const { products } = this.state;

    const token = await getUserToken();
    const refreshToken = await getUserRefreshToken();

    const cartShop = products.filter(el => el.cartCount);
    const addCartSite = cartShop.map(el=>({ id: +el.id, num: +el.cartCount, price_id: +el.price_id, source: "price" }));
    
    for (el of addCartSite) {
      el.id == item.id
      ? await this.props.setItemCountSite(el.id, el.num, el.price_id, el.source, token, refreshToken)
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

  renderCart = item => {
    if (item.hasOwnProperty("cartCount")) {
      return (
        <CartContainer>
          <TouchableWithoutFeedback
            hitSlop={{ left: 0, top: 0, right: 0, bottom: 0 }}
            onPress={() => this[`textInput${item.id}`].focus()}
          >
            <CartTextInputContainer style={{ borderColor:item.inputColor ? "red" : colors.countInput }}>
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
              stylesContainer={{ marginBottom: 10, marginTop: 10}}
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
          <TouchProduct activeOpacity={1}>
          {this.renderImage(item)}
            <ProductContent>
              <Text style={{ fontSize: 16 }}>{item.name}</Text>

              <Text style={{ fontSize: 18, fontWeight: "700" }}>{item.price} {item.currency.name}</Text>

              {Boolean(+item.box) && (
                <Text>{strings("priceDetail.avaibleBox")}{item.box}</Text>
              )}
              <NumOrdersProduct num={num} />
            </ProductContent>
          </TouchProduct>
          {this.renderCart(item)}
          </View>
          <View style={styles.codeAndStockContainer}>
              {
                item.code
                  ? <Text style={styles.codeAndStockText}>{strings("priceDetail.codeItem")}{item.code}</Text>
                  : null
              }
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
    const { products, selected, showAll, shift } = this.state;
    
    const filterProducts = products.filter(product =>
      selected.some(select => select === product.id)
    );

    return (
      <Animated.View
        style={[
          { flex: 1, height: "100%" },
          { transform: [{ translateY: shift }] }
        ]}
      >
        <FlatList
          style={{ paddingTop: 5 }}
          data={showAll ? products : filterProducts}
          extraData={selected}
          renderItem={this.renderItem}
          keyExtractor={item => String(item.id)}
          ItemSeparatorComponent={() => <Separator />}
          ListFooterComponent={<View style={{ paddingBottom: 10 }}/>}
        />
      </Animated.View>
    );
  };

  HeaderComponent = (price, groupShop, shop) => {
    return (
      <PriceInfo>
        <GroupDetailPrice shop={price ? price.shop : groupShop ? groupShop.shop : shop} isViewed={true} />
      </PriceInfo>
    );
  };
 
  confirmOrder = () => {
    this.props.navigation.navigate(ORDER_DETAIL_SECOND_SCREEN, {
      products: this.state.products,
      selected: this.state.selected,
      shift: new Animated.Value(0),
      phone: "",
      comment: "",
      shopId: this.state.shopId,
      price_id: this.state.price_id,
      currencyId: this.state.currencyId,
      isControlSklad: this.state.isControlSklad,
      loading2: false,
      shopInfo: this.state.shopInfo,
      flag: this.state.flag,
      phoneRequire: this.state.phoneRequire,
      noPhone: false,
      shop: this.state.shop ? this.state.shop : this.props.navigation.state.params.groupShop.shop,
      onCartRefresh: this.props.navigation.state.params.onCartRefresh,
      fromPrice: this.props.navigation.state.params.fromPrice,
      fromGroup: this.props.navigation.state.params.fromGroup,
      onSelectedClear: this.props.navigation.state.params.onSelectedClear,
      saved: this.state.saved,
    });
  };

  renderOrder = () => {
    return (
      <View>
        <ConfirmSum
          currencyId={this.state.currencyId}
          value={this.getSum()}
          sendOrder={this.confirmOrder} />
      </View>
    );
  };

  render() {
    const { loading, prices } = this.props;
    const { loading2, shop } = this.state;
    const groupShop = this.props.navigation.state.params.groupShop;
    const priceId = this.props.navigation.state.params.priceId;
    const price = prices.find(price => price.id == priceId);

    if (loading || loading2) {
      return <Spinner />;
    }

    return (
      <ContentWrapper>
        {this.HeaderComponent(price, groupShop, shop)}
        {this.renderProducts()}
        {this.renderOrder()}
      </ContentWrapper>
    );
  };
}

OrderDetailScreen.navigationOptions = ({ navigation }) => ({
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
      onPress={() => navigation.goBack() }
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
    fontSize: 14,
    paddingTop: 5,
    paddingRight: 5,
  },
  itemContainer: {
    backgroundColor: "white",
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
  buttonNavComment: {
    borderWidth: 1,
    borderColor: colors.colorPrimary,
    color: colors.textColorPrimary,
    backgroundColor: colors.colorPrimary,
    fontWeight: "bold",
    fontSize: 12,
    padding: 5,
  },
});
