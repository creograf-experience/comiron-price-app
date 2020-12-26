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
  KeyboardAvoidingView,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";

import ImageZoom from "react-native-image-pan-zoom";
import SwiperFlatList from 'react-native-swiper-flatlist';
import _ from "lodash";

import {
  Spinner,
  IconButton,
  PriceDetailHeader,
  ProductContent,
  CartContainer,
  CartTextInputContainer,
  AddToCart,
  RepeatSum,
  RepeatDirectSum,
  NewBigImage,
} from "../../components";
import {
  ContentWrapper,
  TouchProduct,
  ProductImage,
  Separator,
  ProductBigImage
} from "./components";
import {
  hostImages,
  colors,
  CART_SCREEN
} from "../../constants";

import { NoPrice } from "../MainScreen/components";
import { Price } from "../AllOrderScreen/components/index"; 
import Lightbox from "react-native-lightbox";
import notAvailable from "../../../assets/not-available.png";
import { strings } from "../../../locale/i18n";
import { getUserToken, getUserRefreshToken} from "../../utils";

const { State: TextInputState } = TextInput;
const windowHeight = Dimensions.get('window').height;

Array.prototype.remove = function(value) {
  let idx = this.indexOf(value);
  if (idx != -1) {
    return this.splice(idx, 1);
  };
  return false;
};

export default class AllOrderDetailScreen extends Component {
  constructor(props) {
    super();
    this.state = {
      numberOrder: props.navigation.state.params.numberOrder,
      products: [],
      selected: [],
      shift: new Animated.Value(0),
      token: props.navigation.state.params.token,
      refreshToken: props.navigation.state.params.refreshToken,
      shopId: props.navigation.state.params.shopId,
      showList: props.showList,
      currency: props.navigation.state.params.currency,
      sum: props.navigation.state.params.sum,
      useCart: false, // flag for order button text change
      notUseCart: true, // flag for order button text change,
      details: props.navigation.state.params.details,
      deliveryState: props.navigation.state.params.deliveryState,
      delivery: props.navigation.state.params.delivery,
    };
  }
  async componentDidMount() {
    const { numberOrder, token, refreshToken, shopId } = this.state;
    this.props.clearGetItemSuccess();
    await this.props.orderDetail(token, refreshToken, numberOrder);
    await this.props.getShopInfo(shopId);

    this.keyboardDidShowSub = Keyboard.addListener(
      "keyboardDidShow",
      this.handleKeyboardDidShow
    );
    this.keyboardDidHideSub = Keyboard.addListener(
      "keyboardDidHide",
      this.handleKeyboardDidHide
    );
    this.props.navigation.setParams({ showList: this.showListState });
  }

  componentDidUpdate (prevProps) {
    if (prevProps.singleProduct.length + 1 === this.props.singleProduct.length) {  
      this.props.singleProduct.forEach(el => {
        this.props.orderDetailItems.forEach(product => {
          if (el.id === product.product_id) {
            const newProducts = Object.assign(product, el);
            this.setState({ products: [...this.state.products, newProducts] });
          };
        });
      });
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
        }
        Animated.timing(this.state.shift, {
          toValue: gap,
          duration: 250,
          useNativeDriver: true
        }).start();
        this.setState({ keyboardIsShown: true });
      }
    );
  };

  handleKeyboardDidHide = () => {
    Animated.timing(this.state.shift, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true
    }).start();
    this.setState({ keyboardIsShown: false });
  };

  showListState = () => {
    if (this.state.showList) {
      this.setState({ showList: false });
      this.props.showListClick(false);
      this.props.navigation.setParams({ isClick: true });
      this.props.isClickCheck(true);
    }
    else {
      this.setState({ showList: true });
      this.props.showListClick(true);
      this.props.navigation.setParams({ isClick: false });
      this.props.isClickCheck(false);
    };
  };

  addToCart = id => {
    const { products, selected, details } = this.state;
    const product = details.find(product => product.product_id === id);
    const valkr=+product.num ? `${(+product.num).toFixed(0)}` : `${(+product.num).toFixed(0)}`;
    if(this.props.shop.shop.iscontrolsklad === "0" || product.sklad > 0) {
      const newProduct = {
        ...product,
        cartCount: valkr,
        source: "reorder",
      };

      const index = details.findIndex(product => product.product_id === id);

      const newProducts = details;
      newProducts.splice(index, 1, newProduct);
      const newSelected = selected;
      newSelected.push(id);

      this.setState({ details: newProducts });
      this.setState({ selected: newSelected });
      this.setState({
        useCart: true,
        notUseCart: false,
      });
    } else {
      Alert.alert(strings('priceDetail.noItem'), "", [
        { text: strings('priceDetail.ok')}
      ]);
    };
  };

  replaceProduct = (item) => {
    const { products } = this.state;
    const index = products.findIndex(product => product.id === item.id);
    this.setState({ products });
  };

  changeCartCountRazmerme = (value, item) => {
    if (this.props.shop.shop.iscontrolsklad === "0" || +item.sklad >= +item.cartCount) {
      if (+item.razmerme) {
        item.cartCount = String(Math.ceil(item.cartCount / item.razmerme) * item.razmerme);
        if (item.cartCount === "0") {
          item.cartCount = "";
        };
      };
    }
    else {
      Alert.alert(strings('priceDetail.noCountItem'), "", [
        { text: strings('priceDetail.ok')}
      ]);
      item.cartCount= +item.razmerme ? +item.razmerme : "1";
    };
    item.cartCount = +item.razmerme ? `${(+item.cartCount).toFixed(1)}` : `${+item.cartCount}`;
    this.setState({ product: item });
    this.replaceProduct(item);
  };

  changeCartCount = (value, item) => {
    if (value === "0") {
      this.deleteProduct(item);
      this.setState({ selected: [] });
      return;
    };
    if (+item.box) {
      if (+value < +item.package && +value < +item.package) {
        item.cartCount = item.package;
        return;
      };

      if (+value < +item.cartCount) {
        item.cartCount = `${+item.cartCount - +item.package}`;
        return;
      };

      if (+value > +item.cartCount && +value % +item.cartCount === 0) {
        item.cartCount = value;
        return;
      };

      if (+value > +item.cartCount) {
        item.cartCount = `${+item.cartCount + +item.package}`;
        return;
      };
    };
    item.cartCount = value;
    this.replaceProduct(item);
  };

  incrementCartCount = item => {
    const val = +item.box ? "1" : "1";
    const valkr = +item.razmerme ? item.razmerme : val;
    const value = +item.razmerme ? `${(+item.cartCount + +valkr).toFixed(1)}` : `${(+item.cartCount + +valkr)}`;
    if (this.props.shop.shop.iscontrolsklad === "0" || +item.sklad >= value) {
      item.cartCount = value;
      this.setState({ product: item });
      this.replaceProduct(item);
    } else {
      Alert.alert(strings('priceDetail.noCountItem'), "", [
        { text: strings('priceDetail.ok')}
      ]);
    };
  };

  decrementCartCount = item => {
    const val = +item.box ? "1" : "1";
    const valkr = +item.razmerme ? item.razmerme : val;
    if (+item.cartCount - +valkr <= 0) {
      this.deleteProduct(item);
      return;
    };
    
    const value = +item.razmerme ? `${(+item.cartCount - +valkr).toFixed(1)}` : `${(+item.cartCount - +valkr)}`;
    item.cartCount = value;
    this.setState({ product: item });
    this.replaceProduct(item);
  };

  deleteProduct = item => {
    delete item.cartCount; // delete property 'cartCount' from item
    const removeSelected = this.state.selected.remove(item.product_id);
    this.setState({
      selected: _.without(this.state.selected, item.product_id),
      notUseCart: !this.state.selected ? true : false,
      useCart: this.state.selected.length ? true : false,
    });
  };
  
  addProduct = async item => {
    const token = await getUserToken();
    const refreshToken = await getUserRefreshToken();

    const addItemSite = item.map(el => ({
      id: +el.product_id,
      num: +el.cartCount,
      price_id: +el.price_id,
      source: el.source,
    }));

    for (item of addItemSite) {
      await this.props.addItemSite(item.id, item.num, item.price_id, item.source, token, refreshToken);
    };
    await this.props.addCartLength();
    await this.props.addCartSZ_Length();
  };

  sendOrder = () => {
    const { selected, details } = this.state;

    if (!selected.length) {
      const newProducts = details.map(el => ({
        ...el,
        cartCount: +el.num ? `${(+el.num).toFixed(0)}` : `${(+el.num).toFixed(0)}`,
        source: "reorder",
      }));

      const checkCount = newProducts.find(el => +el.sklad <= +el.cartCount);

      if (this.props.shop.shop.iscontrolsklad === "0" || !checkCount) {
        this.addProduct(newProducts);
        Alert.alert(strings("allOrderScreen.addInCart"), strings("allOrderScreen.goToCart"), [
          { text: strings("priceDetail.ok"), onPress: () => {} },
          { text: strings("allOrderScreen.goToCartBtn"), onPress: () => {this.props.navigation.navigate(CART_SCREEN)} }
        ]);
      } else {
        Alert.alert(strings('priceDetail.noCountItem'), "", [
          { text: strings('priceDetail.ok')}
        ]);
      };
    } else {
      const cartShop = details.filter(el => el.cartCount);
      this.addProduct(cartShop);
      Alert.alert(strings('allOrderScreen.addSpecificInCart'), strings("allOrderScreen.goToCart"), [
        { text: strings('priceDetail.ok'), onPress: () => {} },
        { text: strings("allOrderScreen.goToCartBtn"), onPress: () => {this.props.navigation.navigate(CART_SCREEN)} }
      ]);
    };
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
                style={{ fontSize: 18, fontWeight:"bold" }}
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
    };
    return (
      <View>
      { 
        +item.razmerme ? (
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              marginRight: 10,
              marginLeft: 12,
              marginBottom: 10,
            }}
          >
            {(+item.num).toFixed(1)}
          </Text>
        ) : (
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              marginRight: 10,
              marginLeft: 21,
              marginBottom: 10,
            }}
          >
            {(+item.num).toFixed(0)}
          </Text>
        )
      }
        <AddToCart onPress={() => this.addToCart(item.product_id)}>
          <Image
            style={{height: 50, width: 51, marginRight: 10}}
            source={require("../../../assets/cart.png")}
          />
        </AddToCart>
      </View>
    );
  };

  getSum = () => {
    const { products, selected, details} = this.state;

    const sum = details.reduce(
      (sum, item) => sum + Number(item.num) * item.price,
      0
    );

    const filterProducts = details.filter(product =>
      selected.some(select => select === product.product_id)
    );
    const sumSelected = filterProducts.reduce(
      (sumSelected, item) => sumSelected + Number(+item.cartCount) * item.price,
      0
    );
    const cart = details.some(select => select.cartCount);

    if (cart) {
      return sumSelected;
    }
    else {
      return sum;
    };
  };

  renderItem = ({ item }) => {
    return (
      <View style={[ styles.itemContainer, { shadowOffset: {width: 5, height: 0} } ]}>
        <View style={styles.product}>
          <TouchProduct activeOpacity={1}>
            {this.renderImage(item)}
            <ProductContent>
              <Text style={{ fontSize: 16 }}>{item.product_name}</Text>
              <Text style={{ fontSize: 18, fontWeight: "700" }}>{item.price} {item.currency.name}</Text>
              {
                Boolean(+item.box) && (
                  <Text>{strings("priceDetail.avaibleBox")}{item.box}</Text>
              )}
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
        </View>
      </View>
    );
  };

  renderItemList = ({ item }) => {
    return (
      <View style={[ styles.itemContainer, { shadowOffset: {width: 5, height: 0} } ]}>
        {this.renderBigImage(item)}
        <View style={styles.product}>
          <TouchProduct activeOpacity={1}>
            <ProductContent>
              <Text style={{ fontSize: 16 }}>{item.product_name}</Text>
              <Text style={{ fontSize: 18, fontWeight: "700" }}>{item.price} {item.currency.name}</Text>
              {
                Boolean(+item.box) && (
                  <Text>{strings("priceDetail.avaibleBox")} {item.box}</Text>
              )}
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
        </View>
      </View>
    );
  };

  renderBigImage = (item) => {
    if (item.photo_url) {
      return(
        <View style={{ borderBottomWidth: 1, marginBottom: 10, borderBottomColor: colors.background }}>
          <NewBigImage image={item.photo_url} />
        </View>
      )
    };

    return ( 
      <TouchableOpacity activeOpacity={1}>
        <ProductBigImage source={notAvailable} resizeMode={"contain"} />
      </TouchableOpacity>
    );
  };

  renderImage = item => {
    if (item.photo_url) {
      return (
        <ProductImage source={{ uri: `${hostImages}${item.photo_url}` }} />
      );
    };
    return (
      <ProductImage source={notAvailable} />
    );
  };

  renderProducts = () => {
    const { shift, products, showList } = this.state;

    return (
      <Animated.View
        style={[
          { flex: 1, height: "100%" },
          { transform: [{ translateY: shift }] }
        ]}
      >
        <FlatList
          style={{ paddingTop: 5 }}
          data={this.state.details}
          renderItem={showList ? this.renderItemList : this.renderItem}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <Separator />}
          ListFooterComponent={<View style={{ paddingBottom: 10 }}/>}
          initialNumToRender={50}
          maxToRenderPerBatch={50}
          removeClippedSubviews={true}
        />
      </Animated.View>
    );
  };

  HeaderComponent = () => {
    const numberOrder = this.props.navigation.state.params.numberOrder;
    const shopId = this.props.navigation.state.params.shopId;
    const title = this.props.navigation.state.params.title;
    const date = this.props.navigation.state.params.date;
    const thumbnail_url = this.props.navigation.state.params.thumbnail_url;
    const sum = this.props.navigation.state.params.sum;
    const numberPosition = this.props.navigation.state.params.numberPosition;
    const status = this.props.navigation.state.params.status;
    const comment_shop = this.props.navigation.state.params.comment_shop;
    const deliveryState = this.state.deliveryState;
    const delivery = this.state.delivery;
    const is_sz = this.props.navigation.state.params.is_sz;
    const item = {thumbnail_url};

    return (
      <View>
        <Price 
          name={title}
          date={date}
          shop={shopId}
          thumbnail_url={thumbnail_url}
          numberOrder={numberOrder}
          sum={sum}
          numberPosition={numberPosition}
          currencyName={!this.state.currency ? "₽" : this.state.currency.name}
          status={status}
          comment_shop={comment_shop}
          flag={true}
          deliveryState={deliveryState}
          delivery={delivery}
          item={item}
          is_sz={is_sz}
        />
      </View>
    );
  };

  renderOrder = () =>{
    const { orderSend, useCart } = this.state;

    if (useCart) {
      return (
        <View>
          <RepeatDirectSum
            currencyName={
              !this.state.currency
                ? "₽"
                : this.state.currency.name
            }
            value={this.getSum()}
            sendOrder={this.sendOrder}
          />
        </View>
      );    
    } else {
      return (
        <View>
          <RepeatSum
            currencyName={
              !this.state.currency
                ? "₽"
                : this.state.currency.name
            }
            value={+this.state.sum}
            sendOrder={this.sendOrder}
          />
        </View>
      );
    };
  };

  render() {
    const { details } = this.state;
    const { loading } = this.props;

    if (loading) {
      if(!details.length) {
        return (
          <ContentWrapper>
            <NoPrice text={strings('main.noResult')} />
          </ContentWrapper>
        );
      };
      return <Spinner />;
    };

    if (!details.length && !loading) {
      return (
        <ContentWrapper>
          <NoPrice text={strings('main.noResult')} />
        </ContentWrapper>
      );
    };

    return (
      <ContentWrapper>
        {this.HeaderComponent()}
        {this.renderProducts()}
        <KeyboardAvoidingView behavior="position" enabled>
          {this.renderOrder()}
        </KeyboardAvoidingView>
      </ContentWrapper>
    );
  }
}

AllOrderDetailScreen.navigationOptions = ({ navigation }) => ({
  headerTitle: () => <PriceDetailHeader title={strings("allOrderScreen.order") + navigation.state.params.numberOrder} />,
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
  headerRight: () => (
    <IconButton
      name={navigation.state.params.isClick ? "ios-images" : "ios-list"}
      stylesContainer={Platform.OS === "ios" ? styles.iosHeaderCenter : {}}
      stylesIcon={styles.iconList}
      onPress={navigation.state.params.showList}
    />
  )
});

const styles = StyleSheet.create({
  arrowBack: {
    fontSize: 30,
    marginLeft: 25,
    color: "#8a8c9c",
    marginTop: Platform.OS === "android" ? 20 : windowHeight > 667 ? 0 : 15,
  },
  iconList: {
    fontSize: 27,
    marginRight: 25,
    color: "#8a8c9c",
    marginTop: Platform.OS === "android" ? 18 : windowHeight > 667 ? 0 : 15,
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
    marginBottom: 5,
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
    shadowColor: "rgba(0,0,0,0.05)",
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
