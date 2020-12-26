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
  SafeAreaView,
} from "react-native";

import ImageZoom from "react-native-image-pan-zoom";

import Swiper from "react-native-swiper";

import _ from "lodash";

import { Button } from "../../containers";
import {
  BodyText,
  GroupDetailPrice,
  Spinner,
  IconButton,
  PriceDetailHeader,
  InStock,
  PriceInfo,
  ProductContent,
  CartContainer,
  CartTextInputContainer,
  AddToCart,
  ShopGroupCategories,
  HeaderRightPriceButton,
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
  MAIN_SCREEN,
  PRODUCT_DETAIL_SCREEN,
  ORDER_DETAIL_SCREEN,
  colors,
  SHOP_INFO_SCREEN,
  CATEGORY_SCREEN,
  SHOP_SEARCH_RESULT_SCREEN,
} from "../../constants";

import { getUserToken, getUserRefreshToken } from "../../utils";

import { NoPrice } from "../MainScreen/components";

import {
  getShopGroupNetworkRequest,
  productSearchRequest,
  getCartSiteNetworkRequest,
} from "../../networkers";

const { State: TextInputState } = TextInput;

const windowHeight = Dimensions.get('window').height;

import notAvailable from "../../../assets/not-available.png";
import Lightbox from "react-native-lightbox";
import { strings } from "../../../locale/i18n";
import SwiperFlatList from "react-native-swiper-flatlist";

export default class GroupScreen extends Component {
  state = {
    products: [],
    originProducts: [],
    selected: [],
    showAll: true,
    shift: new Animated.Value(0),
    keyboardIsShown: false,
    showList: this.props.showList,
    searchInput: "",
    loading2: false,
    currencyId: "",
    isControlSklad: "",
    shopId: this.props.navigation.state.params.shopId,
    groupId: this.props.navigation.state.params.groupId,
    defaultGroupId: this.props.navigation.state.params.groupId,
    refreshing: false,
    refreshing1: false,
    page: 0,
    totalpages: this.props.totalpages,
    nextPage: this.props.nextpage,
    firstPageProducts: [],
    onTopRefresh: false,
    originTitle: this.props.navigation.state.params.title,
    filterSubs: [],
    categoryIdsHistory: [],
  };

  async componentDidMount() {
    const {
      getGroup,
      navigation,
      clearProduct,
      groups,
      shop,
    } = this.props;
    const params = navigation.state.params;
    const groupId = params.groupId;

    navigation.setParams({ scrollBack: (() => this.scrollBack()) });

    if (params.saved) {
      // load saved group
      const group = groups.find(el => el.id === groupId);
      const selected = group.selected;

      if (selected && group.products && selected.length) {
        this.setState({
          products: group.products,
          selected,
          currencyId: shop.shop.currency_id,
          isControlSklad: shop.shop.iscontrolsklad,
        });
      } else {
        clearProduct();
        getGroup(groupId, this.state.page);
        this.setState({
          currencyId: shop.shop.currency_id,
          isControlSklad: shop.shop.iscontrolsklad,
        });
      }

      this.keyboardDidShowSub = Keyboard.addListener(
        "keyboardDidShow",
        this.handleKeyboardDidShow
      );
      this.keyboardDidHideSub = Keyboard.addListener(
        "keyboardDidHide",
        this.handleKeyboardDidHide
      );
      this.props.navigation.setParams({ showList: this.showListState });
    } else {
      clearProduct();
      await getGroup(groupId, this.state.page);
      this.setState({
        currencyId: shop.shop.currency_id,
        isControlSklad: shop.shop.iscontrolsklad,
        originProducts: this.props.products,
      });
      
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
  }

  componentDidUpdate(prevProps) {
    // load on 1 product from group
    if (prevProps.products.length + 1 === this.props.products.length) {
      this.setState({
        products: this.props.products,
        firstPageProducts: this.props.products,
      });
    }
  }

  componentWillUnmount() {
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
  }

  handleLoadMore = () => {
    if (this.props.totalpages > 1 && this.props.nextpage) {
      this.setState({ page: this.state.page + 1 }, this.onGetGroups);
    } else return;
  };

  goToTop = async () => {
    this.setState({ onTopRefresh: true });

    this.setState({ page: 0, products: this.state.firstPageProducts });
    this.props.getNextPage(1);
    await this.flatList.scrollToOffset({ animated: true, offset: 0 });

    this.setState({ onTopRefresh: false });
  };

  onGetGroups = async () => {
    const { groupId, page } = this.state;

    this.setState({ refreshing: true });

    const res = await getShopGroupNetworkRequest(groupId, page);

    if (res.products === null) {
      this.setState({ refreshing: false });
      return;
    };

    this.props.getNextPage(res.nextpage);
    this.setState({ products: this.state.products.concat(res.products) });

    this.setState({ refreshing: false });
  };

  onRefresh = async () => {
    const { defaultGroupId, originTitle } = this.state;

    this.setState({refreshing1: true });

    this.setState({ page: 0, filterSubs: [] });
    this.props.navigation.setParams({ title: originTitle, index: 0 });
    this.props.clearProduct();
    await this.props.renewGroup(defaultGroupId, 0);

    this.setState({ refreshing1: false });
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
        const gap =
          windowHeight * 0.9 - keyboardHeight - (fieldTop + fieldHeight);
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
    if (this.state.showList) {
      this.setState({ showList: false });
      this.props.showListClick(false);
      this.props.navigation.setParams({ isClick: true });
      this.props.isClickCheck(true);
    } else {
      this.setState({ showList: true });
      this.props.showListClick(true);
      this.props.navigation.setParams({ isClick: false });
      this.props.isClickCheck(false);
    }
  };

  addToCart = async id => {
    const { products, selected, isControlSklad } = this.state;

    const token = await getUserToken();
    const refreshToken = await getUserRefreshToken();

    const product = products.find(product => product.id === id);

    const val = +product.box ? "1" : "1";

    const valkr = +product.razmerme ? product.razmerme : val;
    if (isControlSklad === "0" && product.sklad > 0) {
      const newProduct = {
        ...product,
        cartCount: valkr,
        source: "price",
      };

      const index = products.findIndex(product => product.id === id);

      const newProducts = products;
      newProducts.splice(index, 1, newProduct);
      const newSelected = selected;
      newSelected.push(newProduct);

      this.setState({ products: newProducts });
      this.setState({ selected: newSelected });
      this.saveGroup();

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
        { text: strings("priceDetail.ok") }
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
        item.cartCount = String(
          Math.ceil(item.cartCount / item.razmerme) * item.razmerme
        );
        if (item.cartCount === "0") {
          item.cartCount = "";
        }
      }
    } else {
      Alert.alert(strings("priceDetail.noCountItem"), "", [
        { text: strings("priceDetail.ok") }
      ]);
      item.cartCount = +item.razmerme ? +item.razmerme : "1";
    }
    item.cartCount = +item.razmerme
      ? `${(+item.cartCount).toFixed(1)}`
      : `${+item.cartCount}`;
    this.setState({ product: item });

    this.replaceProduct(item);
  };

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
    const value = +item.razmerme
      ? `${(+item.cartCount + +valkr).toFixed(1)}`
      : `${+item.cartCount + +valkr}`;

    if (+value > +item.sklad) return;

    if (this.state.isControlSklad === "0" || +item.sklad >= value) {
      item.cartCount = value;
      this.setState({ product: item });
      for (el of products) {
        el.id == item.id ? (el.cartCount = value) : null;
      }
      this.replaceProduct(item);
    } else {
      Alert.alert(strings("priceDetail.noCountItem"), "", [
        { text: strings("priceDetail.ok") }
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
        el.id == item.id ? delete el.cartCount : null;
      }
      const res = await getCartSiteNetworkRequest(shopId, token, refreshToken);
      if (res.cart) {
        const cart = res.cart.cart;
        const cartProduct = cart.find(el => el.product.id === item.id);
        if (cartProduct) {
          await this.props.deleteItemSite(cartProduct.id, token, refreshToken);
          await this.props.addCartLength();
        } else null;
        // cartProduct
        //   ? await this.props.deleteItemSite(cartProduct.id, token, refreshToken)
        //   : null;
      }
      return;
    }

    const value = +item.razmerme
      ? `${(+item.cartCount - +valkr).toFixed(1)}`
      : `${+item.cartCount - +valkr}`;
    item.cartCount = value;
    this.setState({ product: item });

    for (el of products) {
      el.id == item.id ? (el.cartCount = value) : null;
    }
    this.setState({ products });

    this.replaceProduct(item);
  };

  deleteProduct = async item => {
    const selectedCount = this.state.selected.filter(el => el.id !== item.id);
    await delete item.cartCount;
    this.setState({ selected: selectedCount });
    this.saveGroup();
    if (this.state.selected.length === 1) {
      this.setState({ showAll: true });
      this.saveGroup();
      return;
    }
  };

  replaceProduct = async item => {
    const { products } = this.state;

    const token = await getUserToken();
    const refreshToken = await getUserRefreshToken();

    const cartShop = products.filter(el => el.cartCount);
    const addCartSite = cartShop.map(el => ({
      id: +el.id,
      num: +el.cartCount,
      price_id: +el.price_id,
      source: el.source,
    }));
    for (el of addCartSite) {
      el.id == item.id
        ? await this.props.setItemCountSite(
            el.id,
            el.num,
            el.price_id,
            el.source,
            token,
            refreshToken,
          )
        : null;
    }

    this.setState({ products });
    this.saveGroup();
  };

  saveGroup = () => {
    const { products, selected } = this.state;
    const { saveGroup, groups } = this.props;

    const groupId = this.props.navigation.state.params.groupId;
    const group = groups.find(group => group.id === groupId);

    const savedGroup = {
      ...group,
      products,
      saved: true,
      selected,
    };
    saveGroup(savedGroup);
  };

  getSum = () => {
    const { selected } = this.state;

    const sum = selected.reduce(
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
    return (
      <View
        style={[
          styles.itemContainer,
          { shadowOffset: { width: 5, height: 0 } }
        ]}
      >
        <View style={styles.product}>
          <TouchProduct
            onPress={() => {
              this.props.navigation.navigate(PRODUCT_DETAIL_SCREEN, {
                groupId: this.props.navigation.state.params.groupId,
                shopId: this.props.navigation.state.params.shopId,
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
            {this.renderImage(item)}

            <ProductContent>
              <Text style={{ fontSize: 16 }}>{item.name}</Text>

              <Text style={{ fontSize: 18, fontWeight: "700" }}>
                {item.price} {item.currency.name}
              </Text>

              {Boolean(+item.box) && (
                <Text>
                  {strings("priceDetail.avaibleBox")}
                  {item.box}
                </Text>
              )}
            </ProductContent>
          </TouchProduct>
          {this.renderCart(item)}
        </View>
        <View style={styles.codeAndStockContainer}>
          {
            item.code ? (
              <Text style={styles.codeAndStockText}>
                {strings("priceDetail.codeItem")}
                {item.code}
              </Text>
            ) : null
          }
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.codeAndStockText}>
              {strings("priceDetail.avaible")}
            </Text>
            <InStock value={+item.sklad} unit={item.edizm} />
          </View>
        </View>
      </View>
    );
  };

  renderItemList = ({ item }) => {
    return (
      <View
        style={[
          styles.itemContainer,
          { shadowOffset: { width: 5, height: 0 } }
        ]}
      >
        {this.renderBigImage(item)}

        <View style={styles.product}>
          <TouchProduct
            onPress={() => {
              this.props.navigation.navigate(PRODUCT_DETAIL_SCREEN, {
                groupId: this.props.navigation.state.params.groupId,
                shopId: this.props.navigation.state.params.shopId,
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

              <Text style={{ fontSize: 18, fontWeight: "700" }}>
                {item.price} {item.currency.name}
              </Text>

              {Boolean(+item.box) && (
                <Text>
                  {strings("priceDetail.avaibleBox")} {item.box}
                </Text>
              )}
            </ProductContent>
          </TouchProduct>
          {this.renderCart(item)}
        </View>
        <View style={styles.codeAndStockContainer}>
          {
            item.code ? (
              <Text style={styles.codeAndStockText}>
                {strings("priceDetail.codeItem")}
                {item.code}
              </Text>
            ) : null
          }
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.codeAndStockText}>
              {strings("priceDetail.avaible")}
            </Text>
            <InStock value={+item.sklad} unit={item.edizm} />
          </View>
        </View>
      </View>
    );
  };

  renderBigImage = item => {
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
    const { products, selected, showAll, shift, showList, filterSubs, refreshing1, refreshing } = this.state;

    if (!products || !products.length) {
      return (
        <ScrollView
          refreshControl={
            <RefreshControl
              title={strings("priceDetail.refresh")}
              titleColor={colors.textColorSecondary}
              refreshing={refreshing1}
              onRefresh={this.onRefresh}
            />
          }
        >
          <NoPrice text={strings("main.noResult")} />
        </ScrollView>
      );
    }

    const filterProducts = products.filter(product =>
      selected.some(select => select === product.id)
    );

    return (
      <Animated.View
        style={[
          { flex: 1, height: "100%", position: "relative" },
          { transform: [{ translateY: shift }] }
        ]}
      >
        <FlatList
          ListHeaderComponent={!filterSubs.length
            ? <View style={{ padding: 2 }} />
            : null
          }
          ref={flatList => {
            this.flatList = flatList;
          }}
          data={showAll ? products : filterProducts}
          extraData={selected}
          renderItem={showList ? this.renderItemList : this.renderItem}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <Separator />}
          refreshControl={
            <RefreshControl
              title={strings("priceDetail.refresh")}
              titleColor={colors.textColorSecondary}
              refreshing={refreshing1}
              onRefresh={this.onRefresh}
            />
          }
          initialNumToRender={25}
          maxToRenderPerBatch={25}
          updateCellsBatchingPeriod={25}
          removeClippedSubviews={true}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={<View style={{ paddingBottom: 10 }} />}
        />
        {
          refreshing ? (
            <View style={{ paddingTop: 10, paddingBottom: 10 }}>
              <Spinner size="small" />
            </View>
          ) : null
        }
      </Animated.View>
    );
  };

  scrollBack = () => {
    this.swiper.scrollBy(-1);
  };

  GroupHeaderComponent = (group, filterSubs) => (
    <>
      {
        group ? (
          <PriceInfo>
            <GroupDetailPrice shop={group.shop} isViewed={true} />
          </PriceInfo>
        ) : null
      }
      {
        filterSubs ? (
          <ShopGroupCategories
            goCategoryScreen={() => {
              this.props.navigation.navigate(CATEGORY_SCREEN, {
                groups: filterSubs,
                onCategorySearch: this.onCategorySearch,
              });    
            }}
            filter={true}
          />
        ) : null
      }
    </>
  );

  renderOrder = () => {
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
            )
            : (
              <Text style={{ fontSize: 20, fontWeight: "bold", paddingLeft: 20 }}>
                {`${this.getSum().toFixed(2)} RMB`}
              </Text>
            )
          }
          <Button
            fontSize="12"
            text={strings("priceDetail.goToCart")}
            onPress={() => {
              this.props.navigation.navigate(ORDER_DETAIL_SCREEN, {
                groupId: this.props.navigation.state.params.groupId,
                products: this.state.products,
                selected: this.state.selected,
                changeCartCount: this.changeCartCount,
                personId: this.props.navigation.state.params.personId,
                shopId: this.props.navigation.state.params.shopId,
                incrementCartCount: this.incrementCartCount,
                decrementCartCount: this.decrementCartCount,
                changeCartCountRazmerme: this.changeCartCountRazmerme,
                cart: this.props.cart,
                currencyId: this.state.currencyId,
                isControlSklad: this.state.isControlSklad,
                phoneRequire: this.props.shop.shop.isphonerequired,
                groupShop: this.props.shop,
                forCartDeleteProduct: this.forCartDeleteProduct,
                fromGroup: true,
                onSelectedClear: this.onSelectedClear,
              });
            }}
          />
        </View>
      );
    }
    return null;
  };

  onSelectedClear = () => {
    this.setState({
      selected: [],
      products: this.state.products.map(product => {
        delete product.cartCount;
        return product;
      })
    });
  };

  onSearch = async () => {
    if (!this.state.searchInput.length) return;

    this.setState({ loading2: true });

    const { shopId, groupId } = this.props.navigation.state.params;
    const res = await productSearchRequest(
      shopId,
      this.state.searchInput,
      groupId,
      null,
    );

    let data = { products: [], groups: [] };
    if (res.products.length) {
      data = res.products[0];
      delete data.shop;
    }
    this.setState({ loading2: false });

    const { navigation } = this.props;
    return navigation.navigate(SHOP_SEARCH_RESULT_SCREEN, {
      title: navigation.state.params.shop.name,
      products: data.products,
      groups: navigation.state.params.subs,
      properties: [],
      isClick: this.props.isClick,
      shopId: navigation.state.params.shopId,
      personId: navigation.state.params.personId,
      nextpage: res.nextpage,
      searchInput: this.state.searchInput,
      currency: navigation.state.params.shop.currency,
      isControSklad: navigation.state.params.shop.iscontrolsklad,
    });
  };

  onCategorySearch = async (categoryId, propId, fromFilter) => {
    this.setState({ loading2: true });

    this.swiper.scrollBy(1);
    const res = await getShopGroupNetworkRequest(categoryId);
    const response = res.products;

    if (fromFilter) {
      this.props.navigation.setParams({ title: res.group.name });
      this.setState({
        loading2: false,
        products: response,
        groupId: categoryId,
        page: 0,
        firstPageProducts: response,
        nextPage: res.nextpage,
      });
      this.props.getNextPage(1);
      return;
    }

    this.props.navigation.setParams({ title: res.group.name });
    this.setState({
      products: response,
      groupId: categoryId,
      page: 0,
      firstPageProducts: response,
      nextPage: res.nextpage,
      filterSubs: res.group.subs ? res.group.subs : [],
    });
    this.props.getNextPage(1);

    this.setState({ loading2: false });
  };

  resetProducts = async () => {
    this.setState({ page: 0, refreshing: true });

    await this.props.addCartLength();

    const { originProducts, defaultGroupId } = this.state;

    this.setState({ products: originProducts });
    this.setState({ groupId: defaultGroupId });

    this.setState({ refreshing: false });
  };

  chooseGroup = id => {
    this.setState({ categoryIdsHistory: [] });
    this.setState({ categoryIdsHistory: id });
  };

  renderGroupItem = ({ item }) => {
    const { categoryIdsHistory } = this.state;
    if (item.subs === null) {
      return (
        <View style={{ marginLeft: 10, alignItems: "flex-start", marginTop: 10, marginRight: 10 }}>
          <TouchableOpacity 
            onPress={() => this.chooseGroup(item.id)}
          >
            <Text style={ [styles.itemCategory, { backgroundColor: categoryIdsHistory === item.id ? colors.colorPrimary : colors.background} ] }>
              { item.name }
            </Text>
          </TouchableOpacity>
        </View>
      );
    };
    return (
      <View>
        <View style={{ marginLeft: 10, alignItems: "flex-start", marginTop: 10, marginRight: 10}}>
          <TouchableOpacity
            onPress={() => this.chooseGroup(item.id)}
          >
            <Text style={[ styles.itemCategory, { backgroundColor: categoryIdsHistory === item.id ? colors.colorPrimary : colors.background } ]}>
              { item.name }
            </Text>   
          </TouchableOpacity>
        </View>

        <FlatList
          style={{ marginLeft: 30 }}
          extraData={this.state}
          data={item.subs === null ? [] : Object.values(item.subs)}
          renderItem={this.renderGroupItem}
          keyExtractor={item => item.id}
        />
      </View>
    );
  };

  renderGroups = () => {
    const { categoryIdsHistory } = this.state;
    const { navigation } = this.props;
    const subs = this.props.navigation.state.params.subs;

    return (
      <View style={styles.container}>
        {
          subs && subs.length ? (
            <FlatList
              style={{ marginBottom: 10, paddingBottom: 10 }}
              data={subs}
              extraData={this.state}
              renderItem={this.renderGroupItem}
              keyExtractor={item => item.id}
            />
          ) : null
        }
        {
          categoryIdsHistory.length !== 0 ? 
          (
            <View style={{ alignItems:"center", marginBottom: 10, marginTop: 10 }}>
              <Button
                fontSize="16"
                text={strings('priceDetail.show')}
                onPress={() => {
                  navigation.state.params.onCategorySearch(categoryIdsHistory, '');
                }}
              />
            </View>  
          )
          : null
        }
      </View>
    );
  };

  render() {
    const { loading, shop } = this.props;
    const { loading2, onTopRefresh, filterSubs, refreshing1, refreshing } = this.state;
    const groupId = this.props.navigation.state.params.groupId;
    const subs = this.props.navigation.state.params.subs;
    
    if (loading) {
      return <Spinner />;
    }

    if (!groupId && !loading) {
      return (
        <ContentWrapper>
          <ScrollView
            refreshControl={
              <RefreshControl
                title={strings("priceDetail.refresh")}
                titleColor={colors.textColorSecondary}
                refreshing={refreshing1}
                onRefresh={this.onRefresh}
              />
            }
          />
          <BodyText>{strings("priceDetail.notPrice")}</BodyText>
        </ContentWrapper>
      );
    }
    if (!loading) {
      return (
        <>
          {
            subs ? (
              <Swiper
                ref={swiper => {
                  this.swiper = swiper;
                }}
                index={0}
                showsButtons={false}
                nextButton={
                  <Text style={{ color: colors.colorPrimary, fontSize: 56 }}>{""}</Text>
                }
                prevButton={
                  <Text style={{ color: colors.colorPrimary, fontSize: 56 }}>‹</Text>
                }
                showsPagination
                paginationStyle={{ marginBottom: -15 }}
                activeDotColor={colors.colorPrimary}
                loop={false}
                scrollEnabled
                onIndexChanged={(index) => {
                  index == 0 
                    ? this.props.navigation.setParams({ index: 0 })
                    : index == 1
                    ? this.props.navigation.setParams({ index: 1 })
                    : null
                }}
              >
                <SafeAreaView style={{ flex: 1 }}>
                  <ShopGroupCategories
                    groups={subs}
                    onCategorySearch={this.onCategorySearch}
                    resetProducts={this.resetProducts}
                    onRefresh={this.onRefresh}
                    refreshing={refreshing}
                  />
                </SafeAreaView>
                <ContentWrapper>
                  {this.GroupHeaderComponent(shop, filterSubs.length ? filterSubs : null)}

                  {
                    loading2 || onTopRefresh
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
                    ) : null
                  }
                </ContentWrapper>
              </Swiper>
            ) : (
              <ContentWrapper>
                {this.GroupHeaderComponent(shop)}

                {
                  loading2 ?
                    <Spinner style={{ flex: 1 }} />
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
                            'https://raw.githubusercontent.com/AboutReact/sampleresource/master/arrow_up.png',
                        }}
                        style={styles.upButtonImage}
                      />
                    </TouchableOpacity>
                  ) : null
                }
              </ContentWrapper>
            )
          }
        </>
      );
    }
  }
}

GroupScreen.navigationOptions = ({ navigation }) => ({
  headerTitle: () => <PriceDetailHeader title={navigation.state.params.title} />,
  headerStyle: {
    backgroundColor: colors.textColorPrimary,
    height: 80,
  },
  headerLeft: () => (
    !navigation.state.params.index || navigation.state.params.index == 0
      ? <IconButton
          name={"ios-arrow-back"}
          stylesContainer={Platform.OS === "ios" ? styles.iosHeaderCenter : {}}
          stylesIcon={styles.arrowBack}
          onPress={() => {
            navigation.state.params.fromShop
            ? navigation.navigate(SHOP_INFO_SCREEN, { saved: true })
            : navigation.navigate(MAIN_SCREEN, { fromDetail: true });
          }}
        />
      : <IconButton
          {...navigation.state.params}
          name={"ios-arrow-back"}
          stylesContainer={Platform.OS === "ios" ? styles.iosHeaderCenter : {}}
          stylesIcon={styles.arrowBack}
          onPress={navigation.getParam("scrollBack")}
        />
  ),
  headerRight: () => (
    <View
      style={{ flex: 1, flexDirection: "row", justifyContent: "flex-start" }}
    >
      <IconButton
        name={navigation.state.params.isClick ? "ios-images" : "ios-list"}
        stylesContainer={Platform.OS === "ios" ? styles.iosHeaderCenter : {}}
        stylesIcon={styles.iconList}
        onPress={navigation.state.params.showList}
      />
    </View>
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
    marginTop: Platform.OS === "android" ? 14 : windowHeight > 667 ? 0 : 13,
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
    marginTop: Platform.OS === "android" ? 14 : 15,
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
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  itemCategory: {
    borderWidth: 1,
    borderColor: colors.colorPrimary,
    fontSize: 16,
    padding: 5,
  },
  upButton: {
    position: "absolute",
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 70,
  },
  upButtonImage: {
    resizeMode: "contain",
    width: 30,
    height: 30,
    tintColor: colors.colorPrimary,
  },
});
