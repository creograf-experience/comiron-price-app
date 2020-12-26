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
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";

import ImageZoom from "react-native-image-pan-zoom";
import SwiperFlatList from 'react-native-swiper-flatlist';

import _ from "lodash";

import { Button } from "../../containers";
import {
  BodyText,
  Price,
  Spinner,
  IconButton,
  PriceDetailHeader,
  InStock,
  PriceInfo,
  ProductContent,
  CartContainer,
  CartTextInputContainer,
  AddToCart,
  NumOrdersProduct,
  DefaultSearchBar,
  ShopCategories,
  NewBigImage,
} from "../../components";
import {
  ContentWrapper,
  TouchProduct,
  ProductImage,
  Separator,
  Description,
  ProductBigImage,
} from "./components";
import {
  hostImages,
  MAIN_SCREEN,
  PRODUCT_DETAIL_SCREEN,
  ORDER_DETAIL_SCREEN,
  colors,
  CATEGORY_SCREEN,
} from "../../constants";

import { getUserToken, getUserRefreshToken } from "../../utils";

import { NoPrice } from '../MainScreen/components';

import { productSearchRequest, getPriceDetailNetworkRequest, getCartSiteNetworkRequest } from '../../networkers';

const { State: TextInputState } = TextInput;

const windowHeight = Dimensions.get('window').height;

import notAvailable from "../../../assets/not-available.png";
import { strings } from "../../../locale/i18n";


export default class PriceDetailScreen extends Component {
  state = {
    products: [],
    selected: [],
    showAll: true,
    shift: new Animated.Value(0),
    keyboardIsShown: false,
    showList: this.props.showList,
    searchInput: "",
    loading2: false,
    currencyId: "",
    isControlSklad: "",
    cart: [],
    shopId: this.props.navigation.state.params.shopId,
    refreshing: false,
    page: 0,
    firstPageProducts: [],
    onTopRefresh: false,
    lastProducts: [],
    loadingOnMount: false,
  };

  async componentDidMount() {
    const {
      navigation,
      prices,
      setProductsToPrice,
      setNumOrdersProducts,
      clearPrice,
      getPriceProducts,
      getPriceGroup,
    } = this.props;
    const { page } = this.state;
    const params = navigation.state.params;
    const priceId = params.priceId;
    const shopId = params.shopId;
    const userId = params.personId;
    const personId = { person_id: userId };

    this.setState({ loadingOnMount: true });

    this.keyboardDidShowSub = Keyboard.addListener(
      "keyboardDidShow",
      this.handleKeyboardDidShow
    );
    this.keyboardDidHideSub = Keyboard.addListener(
      "keyboardDidHide",
      this.handleKeyboardDidHide
    );
    this.props.navigation.setParams({ showList: this.showListState});

    this.props.postViewPrices(priceId, personId);

    const token = await getUserToken();
    const refreshToken = await getUserRefreshToken();
    const res = await getCartSiteNetworkRequest(shopId, token, refreshToken);
    res.cart ? this.setState({ cart: res.cart.cart }) : this.setState({ cart: [] });

    if (params.saved) {
      // load saved price
      await getPriceGroup(shopId, priceId, userId);
      const price = prices.find(el => el.id === priceId);
      this.setState({ products: price.products });
      const { products } = this.state;
      // const selected = price.selected;
      let selected = [];
      if (this.state.cart.length) {
        products.forEach(el => {
          this.state.cart.forEach(item => {
            if (item.product_id === el.id) {
              // el.cartCount = Number(item.num).toFixed(0);
              // const temp = {
              //   ...el,
              //   cartCount: Number(item.num).toFixed(0),
              // }
              // selected.push(temp);
              selected = price.selected;
            };
          });
        });
      } else products.forEach(el => {
        delete el.cartCount;
      });

      /*price.products.forEach(el => {
        if (el.cartCount) selected.push(el.id);
      });*/
      // this.setState({ products: localCart ? price.products : this.props.products, selected });

      this.setState({ selected });
      this.setState({ products });

      setProductsToPrice({ products: price.products });
      setNumOrdersProducts({ numOrdersProducts: price.numOrdersProducts });
      this.setState({
        currencyId: price.shop.currency_id,
        isControlSklad: price.shop.iscontrolsklad,
      });

      this.setState({ loadingOnMount: false });
      // await getPriceProducts(shopId, priceId, userId);
      return;
    }
    clearPrice();

    await getPriceProducts(shopId, priceId, userId, page);
    const price = prices.find(price => price.id == priceId);
    this.setState({
      currencyId: price.shop.currency_id,
      isControlSklad: price.shop.iscontrolsklad,
    });

    this.setState({ loadingOnMount: false });
  }

  async componentDidUpdate(prevProps) {
    // load on 1 product from price
    if (prevProps.products.length + 1 === this.props.products.length) {
      this.setState({ products: this.props.products, firstPageProducts: this.props.products });
    };
  }

  componentWillUnmount() {
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
    this.props.setPriceGroups([]);
    this.setState({ lastProducts: [] });
  }

  handleLoadMore = () => {
    if (this.state.lastProducts != null) {
      this.setState({ page: this.state.page + 1 }, this.onGetPriceProducts);
    } else return;
  };

  goToTop = async () => {
    this.setState({ onTopRefresh: true });

    this.props.clearPrice();
    this.setState({ page: 0, products: this.state.firstPageProducts });
    await this.flatList.scrollToOffset({ animated: true, offset: 0 });

    this.setState({ onTopRefresh: false });
  };

  onGetPriceProducts = async () => {
    const { navigation } = this.props;
    const params = navigation.state.params;
    const priceId = params.priceId;
    const shopId = params.shopId;
    const userId = params.personId;

    this.setState({ refreshing: true});

    const res = await getPriceDetailNetworkRequest(shopId, priceId, userId, null, null, this.state.page);
    const newProducts = res.data.products;

    if (newProducts) {
      const product = newProducts.map(el => ({
        ...el.product,
        num_orders_sz: el.num_orders_sz,
        currency:el.currency,
      }));
      this.setState({ products: this.state.products.concat(product) });
    } else {
      this.setState({ lastProducts: newProducts, refreshing: false });
      return;
    }

    this.setState({ refreshing: false });
  };

  handleKeyboardDidShow = event => {
    const { height: windowHeight } = Dimensions.get("window");
    const keyboardHeight = event.endCoordinates.height;
    const currentlyFocusedField = TextInputState.currentlyFocusedField();
    UIManager.measure(
      currentlyFocusedField,
      (originX, originY, width, height, pageX, pageY) => {
        const fieldHeight = height;
        const fieldTop = pageY;
        const gap = (windowHeight * 0.9 - keyboardHeight) - (fieldTop + fieldHeight);
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
  }

  handleKeyboardDidHide = () => {
    Animated.timing(this.state.shift, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
    this.setState({ keyboardIsShown: false });
  }

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
    }
  }

  addToCart = async id => {
    const { products, selected } = this.state;

    const token = await getUserToken();
    const refreshToken = await getUserRefreshToken();

    const product = products.find(product => product.id === id);

    const val = +product.box ? "1" : "1";

    const valkr = +product.razmerme ? product.razmerme : val;
    if (this.state.isControlSklad === "0" || product.sklad > 0) {
      const newProduct = {
        ...product,
        cartCount: valkr,
        price_id: this.props.navigation.state.params.priceId,
        source: "price",
      };

      const index = products.findIndex(product => product.id === id);

      const newProducts = products;
      newProducts.splice(index, 1, newProduct);
      const newSelected = selected;
      newSelected.push(newProduct);

      this.setState({ products: newProducts });
      this.setState({ selected: newSelected });
      this.savePrice();

      let addCartSite = {
        id: +newProduct.id,
        num: +newProduct.cartCount,
        price_id: +newProduct.price_id,
        source: newProduct.source,
      };
      await this.props.addItemSite(
        addCartSite.id,
        addCartSite.num,
        addCartSite.price_id,
        addCartSite.source,
        token,
        refreshToken,
      );
      await this.props.addCartLength();
    } else {
      Alert.alert(strings("priceDetail.noItem"), "", [
        { text: strings("priceDetail.ok")}
      ]);
    }
  };

  changeCartCountRazmerme = (value, item) => {
    if (+item.cartCount > +item.sklad) {
      item.cartCount = item.sklad;
      this.setState({ product: item });

      this.replaceProduct(item);
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
        { text: strings("priceDetail.ok") }
      ]);
      item.cartCount = +item.razmerme ? +item.razmerme : "1";
    };
    item.cartCount = +item.razmerme ? `${(+item.cartCount).toFixed(1)}` : `${+item.cartCount}`;
    this.setState({ product: item });

    this.replaceProduct(item);
  }

  changeCartCount = async (value, item) => {
    const { shopId, products } = this.state;

    const token = await getUserToken();
    const refreshToken = await getUserRefreshToken();

    if (+item.sklad >= +value) {
      if (value === "0") {
        this.deleteProduct(item);
        for (el of products) {
          el.id == item.id
            ? delete el.cartCount
            : null;
        }
        this.setState({ products });
        const res = await getCartSiteNetworkRequest(shopId, token, refreshToken);
        if (res.cart) {
          const cart = res.cart.cart;
          const cartProduct = cart.find(el => el.product.id === item.id);
          if (cartProduct) {
            await this.props.deleteItemSite(cartProduct.id, token, refreshToken);
            await this.props.addCartLength();
          } else null;
        }
        return;
      };
      item.cartCount = value;
      for (el of products) {
        el.id == item.id
          ? el.cartCount = value
          : null;
      }
      this.setState({ products });
      this.replaceProduct(item);
      return;
    } else {
      item.cartCount = item.sklad;
      // value = item.sklad;
      // for (el of products) {
      //   el.id == item.id
      //     ? el.cartCount = value
      //     : null;
      // }
      // this.setState({ products });
      // this.replaceProduct(item);
      return;
    };
  };

  incrementCartCount = item => {
    const { products } = this.state;
    const val = +item.box ? "1" : "1";
    const valkr = +item.razmerme ? item.razmerme : val;
    const value = +item.razmerme ? `${(+item.cartCount + +valkr).toFixed(1)}` : `${(+item.cartCount + +valkr)}`;

    if (+value > +item.sklad) return;

    if (this.state.isControlSklad === "0" || +item.sklad >= value) {
      item.cartCount = value;
      this.setState({ product: item });
      for (el of products) {
        el.id == item.id
          ? el.cartCount = value
          : null;
      }
      this.replaceProduct(item);
    } else {
      Alert.alert(strings("priceDetail.noCountItem"), "", [
        { text: strings("priceDetail.ok")}
      ]);
    }
  };

  forCartDeleteProduct = item => {
    const { products } = this.state;
    this.deleteProduct(item);
    for (el of products) {
      el.id == item.id
        ? delete el.cartCount
        : null;
    };
    this.setState({ products });
  };

  decrementCartCount = async item => {
    const { shopId, products } = this.state;

    const token = await getUserToken();
    const refreshToken = await getUserRefreshToken();

    const val = +item.box ? "1" : "1";
    const valkr = +item.razmerme ? item.razmerme : val;
    if (+item.cartCount - +valkr <= 0) {
      this.deleteProduct(item);
      for (el of products) {
        el.id == item.id
          ? delete el.cartCount
          : null;
      };
      this.setState({ products });
      const res = await getCartSiteNetworkRequest(shopId, token, refreshToken);
      if (res.cart) {
        const cart = res.cart.cart;
        const cartProduct = cart.find(el => el.product.id === item.id);
        if (cartProduct) {
          await this.props.deleteItemSite(cartProduct.id, token, refreshToken);
          await this.props.addCartLength();
        } else null;
      }
      return;
    }

    const value = +item.razmerme ? `${(+item.cartCount - +valkr).toFixed(1)}` : `${(+item.cartCount - +valkr)}`;
    item.cartCount = value;
    this.setState({ product: item });

    for (el of products) {
      el.id == item.id
        ? el.cartCount = value
        : null;
    }
    this.setState({ products });
    this.replaceProduct(item);
  };

  deleteProduct = async item => {
    const selectedCount = this.state.selected.filter(el => el.id !== item.id);
    await delete item.cartCount;
    this.setState({
      selected: selectedCount,
    });
    this.savePrice();
    if (this.state.selected.length === 1) {
      this.setState({ showAll: true });
      this.savePrice();
      return;
    }
  };

  replaceProduct = async (item) => {
    const { products } = this.state;

    const token = await getUserToken();
    const refreshToken = await getUserRefreshToken();

    const cartShop = products.filter(el => el.cartCount);
    const addCartSite = cartShop.map(el => ({ id: +el.id, num: +el.cartCount, price_id: +el.price_id, source: el.source }));
    for (el of addCartSite) {
      el.id == item.id
        ? await this.props.setItemCountSite(el.id, el.num, el.price_id, el.source, token, refreshToken)
        : null;
    }
    this.setState({ products });
    this.savePrice();
  };

  savePrice = () => {
    const { products, selected } = this.state;
    const { numOrdersProducts, navigation, prices, savePrice } = this.props;
    const id = navigation.state.params.priceId;
    const price = prices.find(el => el.id === id);
    const savedPrice = {
      ...price,
      products,
      numOrdersProducts,
      saved: true,
      selected,
    };
    savePrice(savedPrice);
  };

  getSum = () => {
    const { selected } = this.state;

    const sum = selected.reduce(
      (sum, item) => sum + Number(item.cartCount) * item.price,
      0
    );

    return sum;
  };

  renderDescription = () => {
    const noDescr = strings("priceDetail.noDescr");

    const { prices} = this.props;
    const priceId = this.props.navigation.state.params.priceId;
    const price = prices.find(price => price.id == priceId);

    if (!price.descr) {
      return <Description>{noDescr}</Description>;
    }

    const regex = /(<([^>]+)>)/gi;

    const description =
      price.descr !== "null" ? price.descr.replace(regex, "") : noDescr;

    return <Description>{description}</Description>;
  };

  renderCart = (item/* , selected */) => {
    const { selected } = this.state;
    // let Id = selected.find(el => el.id == item.id);

    // if (Id) {
      if (selected.length && item.hasOwnProperty("cartCount")) {
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
                stylesContainer={{ marginBottom: 10, marginTop: 10}}
                stylesIcon={{ fontSize: 30, color: colors.dataColor }}
                onPress={() => this.decrementCartCount(item)}
                hitSlop={{ left: 0, top: 0, right: 0, bottom: 0 }}
              />
            </View>
          </CartContainer>
        );
      }

      return (
        <AddToCart onPress={() => this.addToCart(item.id)}>
          <Image
            style={{ height: 50, width: 51, marginRight: 10}}
            source={require("../../../assets/cart.png")}
          />
        </AddToCart>
      );
    // } else {
      /* return (
        <AddToCart onPress={() => this.addToCart(item.id)}>
          <Image
            style={{height: 50, width: 51, marginRight: 10}}
            source={require('../../../assets/cart.png')}
          />
        </AddToCart>
      );
    } */

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
          <TouchProduct
            onPress={() => {
              this.props.navigation.navigate(PRODUCT_DETAIL_SCREEN, {
                priceId: this.props.navigation.state.params.priceId,
                product: item,
                properties: this.props.properties,
                products: this.state.products,
                title: this.props.navigation.state.params.title,
                addToCart: this.addToCart,
                changeCartCount: this.changeCartCount,
                incrementCartCount: this.incrementCartCount,
                decrementCartCount: this.decrementCartCount,
                changeCartCountRazmerme: this.changeCartCountRazmerme,
              });
            }}
          >
            {this.renderImage(item)}

            <ProductContent>
              <Text style={{ fontSize: 16 }}>{item.name}</Text>

              <Text style={{ fontSize: 18, fontWeight: "700"}}>{item.price} {item.currency.name}</Text>

              {Boolean(+item.box) && (
                <Text>{strings("priceDetail.avaibleBox")}{item.box}</Text>
              )}
              <NumOrdersProduct num={num} />
            </ProductContent>
          </TouchProduct>
          {this.renderCart(item/* , this.state.selected ? this.state.selected : null */)}
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

  renderItemList = ({ item }) => {
    const { numOrdersProducts } = this.props;

    const isOrderedEarlier = numOrdersProducts.some(el => el.id === item.id);
    const numOrder = isOrderedEarlier
      ? numOrdersProducts.find(el => el.id === item.id)
      : null;
    const num = isOrderedEarlier ? numOrder.numOrders : null;

    return (
      <View style={[ styles.itemContainer, { shadowOffset: {width: 5, height: 0} } ]}>
        {this.renderBigImage(item)}
        <View style={styles.product}>
          <TouchProduct
            onPress={() => {
              this.props.navigation.navigate(PRODUCT_DETAIL_SCREEN, {
                priceId: this.props.navigation.state.params.priceId,
                product: item,
                products: this.state.products,
                title: this.props.navigation.state.params.title,
                addToCart: this.addToCart,
                changeCartCount: this.changeCartCount,
                incrementCartCount: this.incrementCartCount,
                decrementCartCount: this.decrementCartCount,
                changeCartCountRazmerme: this.changeCartCountRazmerme,
                currencyId: this.state.currencyId,
              });
            }}
          >
            <ProductContent>
              <Text style={{ fontSize: 16 }}>{item.name}</Text>

              <Text style={{ fontSize: 18, fontWeight: "700" }}>{item.price} {item.currency.name}</Text>

              {Boolean(+item.box) && (
                <Text>{strings("priceDetail.avaibleBox")} {item.box}</Text>
              )}
              <NumOrdersProduct num={num} />
            </ProductContent>
          </TouchProduct>
            {this.renderCart(item/*, this.state.selected ? this.state.selected : null*/)}
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

  renderBigImage = (item) => {
    if (item.thumbnail_url) {
      if(item.images.filter(el=>el.thumbnail_url).length) {
        return (
          <View style={{ borderBottomWidth: 1, marginBottom: 10, borderBottomColor: colors.background }}>
            <SwiperFlatList
              data={[{thumbnail_url:item.thumbnail_url},...item.images.filter(el=>el.thumbnail_url)]}
              renderItem={({item})=><NewBigImage image={item.thumbnail_url} />}
              showPagination
              paginationDefaultColor='#c5c6ce'
              paginationActiveColor={colors.colorPrimary}
            />
          </View>
        );
      } else {
        return (
          <View style={{ borderBottomWidth: 1, marginBottom: 10, borderBottomColor: colors.background }}>
              <NewBigImage image={item.thumbnail_url} />
          </View>
        )
      }
    }

    return (
      <TouchableOpacity activeOpacity={1}>
        <ProductBigImage source={notAvailable} resizeMode={"contain"} />
      </TouchableOpacity>
    );
  }

  renderImage = item => {
    if (item.thumbnail_url) {
      return (
        <ProductImage source={{ uri: `${hostImages}${item.thumbnail_url}` }} />
      );
    }
    return <ProductImage source={notAvailable} />;
  };

  renderProducts = () => {
    const { products, selected, showAll, shift, showList } = this.state;
    const { prices } = this.props;

    if (!products) {
      return (
        <NoPrice text={strings("main.noResult")} />
      );
    }

    const filterProducts = products.filter(product =>
      selected.some(select => select === product.id)
    );
    const priceId = this.props.navigation.state.params.priceId;
    const price = prices.find(price => price.id == priceId);

    return (
      <Animated.View
        style={[
          { flex: 1, height: "100%" },
          { transform: [{ translateY: shift }] }
        ]}
      >
        <FlatList
          ListHeaderComponent={() => this.flatListHeaderComponent(price)}
          ref={flatList => {this.flatList = flatList}}
          data={showAll ? products : filterProducts}
          extraData={selected}
          renderItem={showList ? this.renderItemList : this.renderItem}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <Separator />}
          refreshControl={
            <RefreshControl
              title={strings("priceDetail.refresh")}
              titleColor={colors.textColorSecondary}
              refreshing={this.state.refreshing}
              onRefresh={this.resetProducts}
            />
          }
          initialNumToRender={25}
          maxToRenderPerBatch={25}
          updateCellsBatchingPeriod={25}
          removeClippedSubviews={true}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={<View style={{ paddingBottom: 5 }}/>}
        />
        {
          this.state.refreshing
            ? (
              <View style={{ paddingTop: 10, paddingBottom: 10 }}>
                <Spinner size="small" />
              </View>
            )
            : null
        }
      </Animated.View>
    );
  };

  flatListHeaderComponent = price => (
    <>
      <PriceInfo>
          <Price name={price.name} date={price.date} shop={price.shop} isViewed={true}/>
      </PriceInfo>

      {this.renderDescription()}
    </>
  )

  renderOrder = () => {
    const { prices } = this.props;

    const priceId = this.props.navigation.state.params.priceId
    const price = prices.find(el => el.id === priceId);

    if (this.state.selected.length) {
      return (
        <View style={styles.buttons}>
          {
            this.state.currencyId === "1" ? (
              <Text style={{ fontSize: 20, fontWeight: "bold", paddingLeft: 20 }}>
                {`${this.getSum().toFixed(2)} USD`}
              </Text>
            ) : this.state.currencyId === "2" ? (
              <Text style={{ fontSize: 20, fontWeight: "bold", paddingLeft: 20 }}>
                {`${this.getSum().toFixed(2)} ₽`}
              </Text>
            ) : this.state.currencyId === "3" ? (
              <Text style={{ fontSize: 20, fontWeight: "bold", paddingLeft: 20 }}>
                {`${this.getSum().toFixed(2)} EUR`}
              </Text>
            ) : (
              <Text style={{ fontSize: 20, fontWeight: "bold", paddingLeft: 20 }}>
                {`${this.getSum().toFixed(2)} RMB`}
              </Text>
            )
          }
          <Button
            fontSize="12"
            text={strings("priceDetail.goToCart")}
            onPress={() => {this.props.navigation.navigate(ORDER_DETAIL_SCREEN, {
              priceId: this.props.navigation.state.params.priceId,
              products: this.state.products,
              selected: this.state.selected,
              shop: price.shop,
              changeCartCount: this.changeCartCount,
              personId: this.props.navigation.state.params.personId,
              shopId: this.props.navigation.state.params.shopId,
              incrementCartCount: this.incrementCartCount,
              decrementCartCount: this.decrementCartCount,
              changeCartCountRazmerme: this.changeCartCountRazmerme,
              cart: this.props.cart,
              currencyId: this.state.currencyId,
              isControlSklad: this.state.isControlSklad,
              fromPrice: true,
              onSelectedClear: this.onSelectedClear,
              onPopToTop: this.onPopToTop,
              forCartDeleteProduct: this.forCartDeleteProduct,
            })}}
          />
        </View>
      );
    }
    return null;
  };

  onPopToTop = () => {
    this.props.navigation.popToTop();
  };

  onSelectedClear = () => {
    this.setState({ selected: [] });
  };

  onSearch = async () => {
    if (!this.state.searchInput.length) return;
    this.setState({ loading2: true });

    const { shopId, priceId } = this.props.navigation.state.params;
    const res = await productSearchRequest(
      shopId,
      this.state.searchInput,
      null,
      null,
      priceId,
    );

    let data = { products: [] };
    if (res.products.length) {
      data = res.products[0];
      delete data.shop;
    }

    this.setState({
      loading2: false,
      searchInput: "",
      products: data.products,
    });
  };

  onCategorySearch = async (categoryId, property) => {
    this.setState({ loading2: true });

    const { shopId, priceId, personId } = this.props.navigation.state.params;
    const res = await getPriceDetailNetworkRequest(
      shopId,
      priceId,
      personId,
      categoryId ? categoryId : null,
      property ? property: null,
    );

    const numOrdersProducts = res.data.products.map(el => {
      if (el.num_orders) {
        return {
          id: el.id,
          numOrders: el.num_orders,
        };
      }
    });

   this.props.setNumOrdersProducts({ numOrdersProducts });

    const response = res.data.products;
    const product=response.map(el=> ({
      ...el.product,
      num_orders_sz: el.num_orders_sz,
      currency: el.currency,
    }));

    this.setState({ loading2: false, products: product });
  }

  resetProducts = async () => {
    this.setState({ refreshing: true });

    await this.props.addCartLength();

    this.setState({ products: this.state.firstPageProducts });

    this.setState({ refreshing: false });
  }

  render() {
    const { prices, loading, groups, properties } = this.props;
    const { loading2, onTopRefresh, loadingOnMount } = this.state;
    const priceId = this.props.navigation.state.params.priceId;
    const price = prices.find(price => price.id == priceId);

    if (loading || onTopRefresh || loadingOnMount) {
      return <Spinner />;
    }

    if (!price && !loading) {
      return (
        <ContentWrapper>
          <ScrollView
            refreshControl={
              <RefreshControl
                title={strings("priceDetail.refresh")}
                titleColor={colors.textColorSecondary}
                refreshing={this.state.refreshing}
                onRefresh={this.resetProducts}
              />
            }
          />
          <BodyText>{strings("priceDetail.notPrice")}</BodyText>
        </ContentWrapper>
      );
    }

    return (
      <ContentWrapper>
        <DefaultSearchBar
          placeholderText={strings("shopsScreen.searchItem")}
          value={this.state.searchInput}
          onClear={() => this.setState({ searchInput: "" })}
          onChangeText={text => this.setState({ searchInput: text })}
          onEndEditing={this.onSearch}
        />
        {
          groups.length
            ? <ShopCategories
                goCategoryScreen={() => {
                  this.props.navigation.navigate(CATEGORY_SCREEN, {
                    groups: groups,
                    properties: properties,
                    onCategorySearch: this.onCategorySearch,
                  })
                }}
                groups={groups}
                onCategorySearch={this.onCategorySearch}
                resetProducts={this.resetProducts}
              />
            : null
        }
        {
          loading2
            ? <Spinner style={{ flex: 1 }} />
            : this.renderProducts()
        }
        {this.renderOrder()}

        {
          this.state.page >= 1 ? (
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={this.goToTop}
              style={styles.upButton}
            >
              <Image
                source={{
                  uri:
                    "https://raw.githubusercontent.com/AboutReact/sampleresource/master/arrow_up.png",
                }}
                style={styles.upButtonImage}
              />
            </TouchableOpacity>
          )
          : null
        }
      </ContentWrapper>
    );
  }
}

PriceDetailScreen.navigationOptions = ({ navigation }) => ({
  headerTitle: () => ( <PriceDetailHeader title={navigation.state.params.title} /> ),
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
      onPress={() => { navigation.goBack() }}
    />
  ),
  headerRight: () => (
    <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-start" }}>
      <IconButton
        name={navigation.state.params.isClick ? "ios-images" : "ios-list"}
        stylesContainer={Platform.OS === "ios" ? styles.iosHeaderCenter : {}}
        stylesIcon={styles.iconList}
        onPress={navigation.state.params.showList}
      />
    </View>
  )
})

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
    marginTop: Platform.OS === "android" ? 14 : windowHeight > 667 ? 0 : 15,
  },
  iosHeaderCenter: {
    height: "100%",
    alignItems: "center",
    marginBottom: 5,
  },
  stylesIcon: {
    width: 25,
    height: 27,
    marginRight: 12,
    marginBottom: Platform.OS === "ios" ? 20 : 0,
    marginTop: Platform.OS === "android" ? 18 : 0,
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
  footer: {
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  loadOnTopBtn: {
    padding: 10,
    backgroundColor: colors.colorPrimary,
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
  },
  btnText: {
    color: "white",
    fontSize: 15,
    textAlign: "center",
  },
  upButton: {
    position: "absolute",
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 370,
  },
  upButtonImage: {
    resizeMode: "contain",
    width: 30,
    height: 30,
    tintColor: colors.colorPrimary,
  },
});
