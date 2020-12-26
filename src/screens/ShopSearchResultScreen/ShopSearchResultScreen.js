import React, { Component } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  Text,
  TextInput,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  Dimensions,
  UIManager,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  RefreshControl,
} from "react-native";

import ImageZoom from "react-native-image-pan-zoom";

import _ from "lodash";

import { Button } from "../../containers";
import {
  Spinner,
  IconButton,
  PriceDetailHeader,
  InStock,
  ProductContent,
  CartContainer,
  CartTextInputContainer,
  AddToCart,
  DefaultSearchBar,
  ShopFilter,
  ShopCategories,
  NewBigImage,
} from "../../components";
import {
  ContentWrapper,
  TouchProduct,
  ProductImage,
  Separator,
  ProductBigImage,
} from "../PriceDetailScreen/components";
import {
  hostImages,
  PRODUCT_DETAIL_SCREEN,
  ORDER_DETAIL_SCREEN,
  colors,
  CATEGORY_SCREEN,
  BAR_CODE_SCANNER_SCREEN,
} from "../../constants";

import { getUserToken, getUserRefreshToken } from "../../utils";

import { productSearchRequest, getCartSiteNetworkRequest } from "../../networkers";

import { NoPrice } from "../MainScreen/components";

const { State: TextInputState } = TextInput;

const windowHeight = Dimensions.get('window').height;

import notAvailable from "../../../assets/not-available.png";
import Lightbox from "react-native-lightbox";
import { strings } from "../../../locale/i18n";
import SwiperFlatList from "react-native-swiper-flatlist";

export default class ShopSearchResultScreen extends Component {
  state = {
    products: [],
    selected: [],
    showAll: true,
    shift: new Animated.Value(0),
    keyboardIsShown: false,
    showList: this.props.showList,
    searchInput: this.props.navigation.state.params.searchInput,
    loading: false,
    loading2: false,
    refreshing: false,
    page: 0,
    fromCategory: false,
    initialProducts: this.props.navigation.state.params.products,
    currency: this.props.navigation.state.params.currency,
    isControlSklad: this.props.navigation.state.params.isControSklad,
    shopId: this.props.navigation.state.params.shopId,
  };

  componentDidMount() {
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
  };

  handleKeyboardDidHide = () => {
    Animated.timing(this.state.shift, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
    this.setState({ keyboardIsShown: false });
  };

  showListState = () => {
    if (this.state.showList){
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
  };

  addToCart = async id => {
    const { selected, isControlSklad } = this.state;
    const { products } = this.props.navigation.state.params;

    const token = await getUserToken();
    const refreshToken = await getUserRefreshToken();

    const product = products.find(product => product.id === id);
    const val = +product.box ? "1" : "1";

    const valkr=+product.razmerme ? product.razmerme:val;
    if (isControlSklad === "0" || product.sklad > 0) {
      const newProduct = {
        ...product,
        cartCount: valkr,
        price_id: this.props.navigation.state.params.priceId,
        source: "search",
      };

      const index = products.findIndex(product => product.id === id);

      const newProducts = products;
      newProducts.splice(index, 1, newProduct);
      const newSelected = selected;
      newSelected.push(id);

      this.setState({ products: newProducts });
      this.setState({ selected: newSelected });

      let addCartSite = {
        id: +newProduct.id,
        num: +newProduct.cartCount,
        price_id: +newProduct.price_id,
        source: newProduct.source,
      };
      await this.props.addItemSite(addCartSite.id, addCartSite.num, addCartSite.price_id, addCartSite.source, token, refreshToken);
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

    if(this.state.isControlSklad === "0" || +item.sklad >= +item.cartCount) {
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
      item.cartCount= +item.razmerme ? +item.razmerme : "1";
    }
    item.cartCount = +item.razmerme ? `${(+item.cartCount).toFixed(1)}` : `${+item.cartCount}`;
    this.setState({ product: item });

    this.replaceProduct(item);
  };

  changeCartCount = async (value, item) => {
    const { shopId } = this.props.navigation.state.params.shopId;

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
    const val = +item.box ? "1" : "1";
    const valkr = +item.razmerme ? item.razmerme : val;
    const value = +item.razmerme ? `${(+item.cartCount + +valkr).toFixed(1)}` : `${(+item.cartCount + +valkr)}`;

    if (+value > +item.sklad) return;

    if (this.state.isControlSklad === "0" || +item.sklad >= value) {
      item.cartCount = value;
      this.setState({ product: item });
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
    const { shopId } = this.state;

    const token = await getUserToken();
    const refreshToken = await getUserRefreshToken();

    const val = +item.box ? "1" : "1";
    const valkr = +item.razmerme ? item.razmerme : val;
    if (+item.cartCount - +valkr <= 0) {
      const res = await getCartSiteNetworkRequest(shopId, token, refreshToken);
      if (res.cart) {
        const cart = res.cart.cart;
        const cartProduct = cart.find(el => el.product.id === item.id);
        if (cartProduct) {
          await this.props.deleteItemSite(cartProduct.id, token, refreshToken);
          await this.props.addCartLength();
        } else null;
      }
      this.deleteProduct(item);
      return;
    }
    
    const value = +item.razmerme ? `${(+item.cartCount - +valkr).toFixed(1)}` : `${(+item.cartCount - +valkr)}`;
    item.cartCount = value;
    this.setState({ product: item });

    this.replaceProduct(item);
  };

  deleteProduct = item => {
    delete item.cartCount;
    this.setState({ selected: _.without(this.state.selected, item.id) });
    if (this.state.selected.length === 1) {
      this.setState({ showAll: true });
      return;
    }
  };

  replaceProduct = async (item) => {
    const { products } = this.state;

    const token = await getUserToken();
    const refreshToken = await getUserRefreshToken();

    const cartShop = products.filter(el => el.cartCount);
    const addCartSite = cartShop.map(el=>({ id: +el.id, num: +el.cartCount, price_id: +el.price_id, source: el.source }));
    for (item of addCartSite) {
      await this.props.setItemCountSite(item.id, item.num, item.price_id, item.source, token, refreshToken);
    }
    this.setState({ products });
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
            <CartTextInputContainer>
              <TextInput
                ref={input => (this[`textInput${item.id}`] = input)}
                defaultValue={item.cartCount}
                onChangeText={value => this.changeCartCount(value, item)}
                keyboardType="numeric"
                style={{ fontSize: 18,fontWeight:"bold" }}
                returnKeyType="done"
                onBlur={value=>this.changeCartCountRazmerme(value, item)}
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
          style={{ height: 50, width: 51, marginRight: 10 }}
          source={require("../../../assets/cart.png")}
        />
      </AddToCart>
    );
  };

  renderItem = ({ item }) => {
    const { navigation } = this.props;
    return (
      <View style={[ styles.itemContainer, { shadowOffset: {width: 5, height: 0} } ]}>
        <View style={styles.product}>
          <TouchProduct
            onPress={() => {
              navigation.navigate(PRODUCT_DETAIL_SCREEN, {
                product: item,
                products: navigation.state.params.products,
                title: navigation.state.params.title,
                addToCart: this.addToCart,
                changeCartCount: this.changeCartCount,
                incrementCartCount: this.incrementCartCount,
                decrementCartCount: this.decrementCartCount,
                changeCartCountRazmerme:this.changeCartCountRazmerme,
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

  renderItemList = ({ item }) => {
    const { navigation } = this.props;

    return (
      <View style={[ styles.itemContainer, { shadowOffset: {width: 5, height: 0} } ]}>
       
        {this.renderBigImage(item)}
          
        <View style={styles.product}>
          <TouchProduct
            onPress={() => {
              this.props.navigation.navigate(PRODUCT_DETAIL_SCREEN, {
                product: item,
                products: navigation.state.params.products,
                title: this.props.navigation.state.params.title,
                addToCart: this.addToCart,
                changeCartCount: this.changeCartCount,
                incrementCartCount: this.incrementCartCount,
                decrementCartCount: this.decrementCartCount,
                changeCartCountRazmerme:this.changeCartCountRazmerme,
                currencyId:this.state.currency.id,
              });
            }}
          >
            <ProductContent>
              <Text style={{ fontSize: 16 }}>{item.name}</Text>

              <Text style={{ fontSize: 18, fontWeight: "700" }}>{item.price} {item.currency.name}</Text>

              {Boolean(+item.box) && (
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
    const { navigation } = this.props;
    const { shift, showList, refreshing } = this.state;

    if (!navigation.state.params.products.length) {
      return (
        <ScrollView
          refreshControl={
            <RefreshControl
              title={strings("priceDetail.refresh")}
              titleColor={colors.textColorSecondary}
              refreshing={refreshing}
              onRefresh={this.resetProducts}
            />
          }
        >
          <NoPrice text={strings("main.noResult")} />
        </ScrollView>
      );
    }

    return (
      <Animated.View
        style={[
          { flex: 1, height: "100%" },
          { transform: [{ translateY: shift }] }
        ]}
      > 
        <FlatList
          data={navigation.state.params.products}
          renderItem={showList ? this.renderItemList : this.renderItem}
          keyExtractor={item => item.id}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={0.5}
          ItemSeparatorComponent={() => <Separator />}
          refreshControl={
            <RefreshControl
              title={strings("priceDetail.refresh")}
              titleColor={colors.textColorSecondary}
              refreshing={refreshing}
              onRefresh={this.resetProducts}
            />
          }
        />
      </Animated.View>
    );
  };

  handleLoadMore = async () => {
    const { shopId, nextpage, products } = this.props.navigation.state.params;
    if (!nextpage || this.state.fromCategory) return;

    await this.setState({ page: this.state.page + 1, refreshing: true });

    const res = await productSearchRequest(
      shopId,
      this.state.searchInput,
      null,
      null,
      null,
      this.state.page
    );

    await this.props.navigation.setParams({
      products: [...products, ...res.products[0].products],
      // products: [...products, ...(res.products.length ? res.products[0].products && res.products[0].products : [])],
      nextpage: res.nextpage
    });

    this.setState({ refreshing: false });
  };

  renderOrder = () => {
    if (this.state.selected.length) {
      return (
        <View style={styles.buttons}>
          <Text 
            style={{
              fontSize: 20,
              fontWeight: "bold",
              paddingLeft: 20,
            }}
          >
            {`${this.getSum().toFixed(2)} ${this.state.currency.name}`}
          </Text>
          <Button
            fontSize="12"
            text={strings("priceDetail.issueOrder")}
            onPress={() => {this.props.navigation.navigate(ORDER_DETAIL_SCREEN, {
              priceId: this.props.navigation.state.params.priceId,
              products: this.props.navigation.state.params.products,
              selected: this.state.selected,
              changeCartCount: this.changeCartCount,
              personId: this.props.navigation.state.params.personId,
              shopId: this.props.navigation.state.params.shopId,
              shop: this.props.navigation.state.params.shop,
              incrementCartCount: this.incrementCartCount,
              decrementCartCount: this.decrementCartCount,
              changeCartCountRazmerme: this.changeCartCountRazmerme,
              cart: this.props.cart,
              currencyId: this.state.currency.id,
              isControlSklad: this.state.isControlSklad,
              forCartDeleteProduct: this.forCartDeleteProduct,
              fromPrice: true,
            })}}
          />
        </View>
      );
    }
    return null;
  };

  onSearch = async () => {
    const { searchInput } = this.state;

    if (!this.state.searchInput.length) return;

    await this.setState({
      loading: true,
      loading2: true,
      page: 0,
      fromCategory: false,
    });

    const { shopId } = this.props.navigation.state.params;
    const res = await productSearchRequest(
      shopId,
      searchInput.match(/[-/!()@\|~$]+/g) ? searchInput.replace(/[-/!()@\|~$]+/g, "") : searchInput
    );

    let data = { products: [], groups: [] };
    if (res.products.length) {
      data = res.products[0];
      data.groups = data.groups === null ? [] : Object.values(data.groups);
      delete data.shop;
    }

    const { navigation } = this.props;
    await  navigation.setParams({
      products: data.products,
      groups: data.groups,
      properties: data.productproperties,
      nextpage: res.nextpage,
    });

    this.setState({ loading: false, loading2: false });
  }

  onCategorySearch = async (categoryId, property) => {
    const { searchInput } = this.state;

    await this.setState({ loading: true, fromCategory: true });

    let res = {};
    const { shopId } = this.props.navigation.state.params;

    if (property.match(/\&/)) {
      property.match(/\//)
        ? (
          res = await productSearchRequest(
            shopId,
            searchInput.match(/[-/!()@\|~$]+/g) ? searchInput.replace(/[-/!()@\|~$]+/g, "") : searchInput,
            categoryId ? categoryId : null,
            property ? property.replace(/\//, "\\/") : null,
          )
        )
        : (
          res = await productSearchRequest(
            shopId,
            searchInput.match(/[-/!()@\|~$]+/g) ? searchInput.replace(/[-/!()@\|~$]+/g, "") : searchInput,
            categoryId ? categoryId : null,
            property ? property : null,
          )
        )
    } else {
      let newProp = "&property[]=" + property;
      res = await productSearchRequest(
        shopId,
        searchInput.match(/[-/!()@\|~$]+/g) ? searchInput.replace(/[-/!()@\|~$]+/g, "") : searchInput,
        categoryId ? categoryId : null,
        newProp.match(/\//) ? newProp.replace(/\//, "\\/") : newProp,
      );
    }

    let data = { products: [] };

    if (res.products.length) {
      data = res.products[0];
      delete data.shop;
    }

    const { navigation } = this.props;
    await navigation.setParams({ products: data.products });

    this.setState({ loading: false });
  };

  resetProducts = async () => {
    this.setState({ refreshing: true });
    const { initialProducts } = this.state;
    const { navigation } = this.props;

    await this.props.addCartLength();

    navigation.setParams({ products: initialProducts });
    this.setState({ fromCategory: false });
    this.setState({ refreshing: false });
  };

  render() {
    const { groups, properties } = this.props.navigation.state.params;
    const { loading, loading2, refreshing } = this.state;

    return (
      <ContentWrapper>
        <DefaultSearchBar
          placeholderText={strings("shopsScreen.searchItemShop")}
          value={this.state.searchInput}
          onClear={() => this.setState({ searchInput: '' })}
          onChangeText={text => this.setState({ searchInput: text })}
          onEndEditing={this.onSearch}
        />
        {
          !loading2 && groups && groups.length ? (
            <ShopCategories
              goCategoryScreen={() => {this.props.navigation.navigate(CATEGORY_SCREEN, {
                groups: groups,
                properties: properties,
                onCategorySearch: this.onCategorySearch,
              })}}
              groups={groups}
              onCategorySearch={this.onCategorySearch}
              resetProducts={this.resetProducts}
            />
          )
          : null
        }
        {
          !loading2 && properties && properties.length ? (
            <ShopFilter
              goCategoryScreen={() => {!groups.length ? (
                this.props.navigation.navigate(CATEGORY_SCREEN, {
                  groups: groups,
                  properties: properties,
                  onCategorySearch: this.onCategorySearch,
                })
              ) : null
              }}
              properties={properties}
              groups={groups}
              onCategorySearch={this.onCategorySearch}
              resetProducts={this.resetProducts}
            />
          ) 
          : null
        }
        {
          loading
            ? <Spinner style={{ flex: 1 }} />
            : this.renderProducts()
        }
        {
          refreshing ? (
            <View style={{ backgroundColor: "white" }}>
              <ActivityIndicator
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
                size="small"
                color="black"
              />
            </View>
          )
          : null
        }
        {this.renderOrder()}
      </ContentWrapper>
    );
  }
}

ShopSearchResultScreen.navigationOptions = ({ navigation }) => ({
  headerTitle: () => <PriceDetailHeader title={navigation.state.params.title} />,
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
      onPress={() => {navigation.state.params.scanned
      ? navigation.navigate(BAR_CODE_SCANNER_SCREEN, { scanned: false })
      : navigation.goBack()}}
    />
  ),
  headerRight: () => (
    <IconButton
      name={navigation.state.params.isClick ? "ios-images" : "ios-list"}
      stylesContainer={Platform.OS === "ios" ? styles.iosHeaderCenter : {}}
      stylesIcon={styles.iconList}
      onPress={navigation.state.params.showList}
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
  iconList: {
    fontSize: 30,
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
});
