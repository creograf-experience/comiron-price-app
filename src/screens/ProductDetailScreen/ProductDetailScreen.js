import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  Dimensions,
  UIManager,
  Image,
  FlatList,
  ScrollView
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import SwiperFlatList from 'react-native-swiper-flatlist';
import { Button } from "../../containers";
import {
  IconButton,
  PriceDetailHeader,
  PriceInfo,
  Price,
  GroupDetailPrice,
  ProductContent,
  CartContainer,
  CartTextInputContainer,
  AddToCart,
  Spinner,
  NumOrdersProduct,
  NewBigImage,
} from "../../components";
import {
  ContentWrapper,
  ProductImage,
  Description,
  Product,
  MeasurableBottomContent,
  MeasurableSum,
} from "./components";
import {
  hostImages,
  colors,
} from "../../constants";

import notAvailable from "../../../assets/not-available.png";
import { strings } from '../../../locale/i18n'

const { State: TextInputState } = TextInput;

const windowHeight = Dimensions.get('window').height;

export default class ProductDetailScreen extends Component {
  constructor(props) {
    super();
    this.state = {
      product: props.navigation.state.params.product,
      products: props.navigation.state.params.products,
      value: "", // amount of measurable product
      showImage: true,
      shift: new Animated.Value(0),
      keyboardIsShown: false,
      isVisible: true,
      currencyId: props.navigation.state.params.currencyId,
      groupId: props.navigation.state.params.groupId,
      shopId: props.navigation.state.params.shopId,
    };
  }

  async componentDidMount() {
    const { getShopProductInfo } = this.props;
    const { product } = this.state;

    const productId = product.id;

    await getShopProductInfo(productId);
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
        const gap = windowHeight - keyboardHeight - (fieldTop + fieldHeight);

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

  addToCart = async item => {
    await this.props.navigation.state.params.addToCart(item.id);
    this.setState({ product: item });
  };

  changeCartCountRazmerme = (value, item) => {
    this.props.navigation.state.params.changeCartCountRazmerme(value, item);
    this.setState({ product: item });
  };

  changeCartCount = async (value, item) => {
    if (value === "0") this.setState({ showImage: true });
    await this.props.navigation.state.params.changeCartCount(value, item);
    this.setState({ product: item });
  };

  incrementCartCount = item => {
    this.props.navigation.state.params.incrementCartCount(item);
    this.setState({ product: item });
  };

  decrementCartCount = async item => {
    await this.props.navigation.state.params.decrementCartCount(item);
    this.setState({ product: item });
  };

  changeMeasurableCartCount = val => {
    if (val === "0" || val === "") {
      this.setState({ value: "" });
      this.setState({ showImage: true });
      return;
    }
    this.setState({ value: val });
  };

  decrementMeasurableCartCount = () => {
    const val = +this.state.product.box ? this.state.product.package : 1;

    if (+this.state.value === val) {
      this.setState({ value: "" });
      this.setState({ showImage: true });
      return;
    };

    this.setState({ value: String(+this.state.value - val) });
  };

  getSum = () => {
    const { products } = this.state;
    const product = products.find(prod => prod.id === this.state.product.id);
    const filterOtherProducts = products.filter(el => {
      if (el.cartCount && el.id !== product.id) return el;
    });
    const otherProductsSum = filterOtherProducts.reduce(
      (sum, item) => sum + Number(item.cartCount) * item.price,
      0
    );
    const productSum = product.cartCount
      ? Number(product.cartCount) * product.price
      : 0;
    const sum = otherProductsSum + productSum;

    return sum;
  }

  renderImage = (item, isBig) => {
    if (item.thumbnail_url) {
      if(!isBig) {
        return (
          <ProductImage
            source={{ uri: `${hostImages}${item.thumbnail_url}` }}
            isBig={isBig}
          />
        )
      }
      if(item.images.filter(el=>el.thumbnail_url).length) {
        return (
            <SwiperFlatList
              data={[{thumbnail_url:item.thumbnail_url},...item.images.filter(el=>el.thumbnail_url)]}
              renderItem={({item})=><NewBigImage image={item.thumbnail_url} />}
              showPagination
              paginationDefaultColor='#c5c6ce'
              paginationActiveColor={colors.colorPrimary}
            />
        );
      } else {
        return (
            <NewBigImage image={item.thumbnail_url} /> 
        )
      } 
      
    }

    return <ProductImage source={notAvailable} isBig={isBig} />;
  };

  renderCart = item => {
    const measurable = +this.state.product.ismerniy ? true : false;
    const { products } = this.state;
    const product = products.find(prod => prod.id === this.state.product.id);

    if (product.hasOwnProperty("cartCount")) {
      return (
        <View style={{ alignItems: "center" }}>
          {measurable && (
            <Text style={styles.cartTitle}>
              {this.props.navigation.state.params.product.edizm}
            </Text>
          )}

          <CartContainer>
            <TouchableWithoutFeedback
              hitSlop={{ left: 0, top: 0, right: 0, bottom: 0 }}
              onPress={() => this.textInput.focus()}
            >
              <CartTextInputContainer>
                <TextInput
                  ref={input => (this.textInput = input)}
                  defaultValue={product.cartCount}
                  onChangeText={value => this.changeCartCount(value, product)}
                  keyboardType="numeric"
                  style={{ fontSize: 18, fontWeight: "bold" }}
                  returnKeyType="done"
                  onBlur={value => {this.changeCartCountRazmerme(value,product), this.setState({ showImage: true })}}
                  onFocus={() => this.setState({ showImage: false })}
                />
              </CartTextInputContainer>
            </TouchableWithoutFeedback>

            <View style={{ marginLeft: 15, marginRight: 10 }}>
              <IconButton
                  name={"ios-add-circle-outline"}
                  stylesContainer={{ marginTop: 10, marginBottom: 5 }}
                  stylesIcon={{ fontSize: 30, color: colors.dataColor }}
                  onPress={() => this.incrementCartCount(product)}
                  hitSlop={{ left: 0, top: 0, right: 0, bottom: 0 }}
              />

              <IconButton
                name={"ios-remove-circle-outline"}
                stylesContainer={{ marginBottom: 10, marginTop: 10}}
                stylesIcon={{ fontSize: 30, color: colors.dataColor }}
                onPress={() => this.decrementCartCount(product)}
                hitSlop={{ left: 0, top: 0, right: 0, bottom: 0 }}
              />
            </View>
          
          </CartContainer>
        </View>
      );
    }

    return (
      <View style={{ alignItems: "center" }}>
        {measurable && (
          <Text style={styles.cartTitle}>
            {this.props.navigation.state.params.product.edizm}
          </Text>
        )}

        <AddToCart onPress={() => this.addToCart(item)}>
          <Image
            style={{height: 50, width: 51, marginRight: 10}}
            source={require("../../../assets/cart.png")}
          />
        </AddToCart>
      </View>
    );
  };

  renderMeasurableCart = () => {
    const step = +this.state.product.box ? this.state.product.package : 1;

    if (this.state.value) {
      return (
        <View style={{ alignItems: "center" }}>
          <Text style={styles.cartTitle}>{strings('productDetail.pack')}</Text>

          <CartContainer>
            <TouchableWithoutFeedback
              hitSlop={{ left: 0, top: 0, right: 0, bottom: 0 }}
              onPress={() => this.textInput.focus()}
            >
              <CartTextInputContainer>
                <TextInput
                  ref={input => (this.textInput = input)}
                  value={this.state.value}
                  onChangeText={val => this.changeMeasurableCartCount(val)}
                  keyboardType="numeric"
                  style={{ fontSize: 18 }}
                  onFocus={() => this.setState({ showImage: false })}
                  onBlur={() => this.setState({ showImage: true })}
                />
              </CartTextInputContainer>
            </TouchableWithoutFeedback>

            <View style={{ marginLeft: 15, marginRight: 10 }}>
              <IconButton
                name={"add"}
                stylesContainer={{ marginTop: 10, marginBottom: 5 }}
                stylesIcon={{ fontSize: 40 }}
                onPress={() =>
                  this.setState({ value: String(+this.state.value + step) })
                }
                hitSlop={{ left: 0, top: 0, right: 0, bottom: 0 }}
              />
              <IconButton
                name={"remove"}
                stylesContainer={{ marginBottom: 10, marginTop: 5 }}
                stylesIcon={{ fontSize: 40 }}
                onPress={this.decrementMeasurableCartCount}
                hitSlop={{ left: 0, top: 0, right: 0, bottom: 0 }}
              />
            </View>
          </CartContainer>
        </View>
      );
    }

    return (
      <View style={{ alignItems: "center" }}>
        <Text style={styles.cartTitle}>{strings("productDetail.pack")}</Text>

        <AddToCart onPress={() => this.setState({ value: `${step}` })}>
          <Ionicons name="ios-add-circle" style={{ fontSize: 20, marginRight: 5 }} />

          <Ionicons name="ios-cart" />
        </AddToCart>
      </View>
    );
  };

  renderProperties = ({ item }) => {
    return (
      <View>
        <Text style={{ fontSize: 12}}>
          {`${item.name}: ${item.value}`}
        </Text>   
      </View>
    );
  };

  renderDescription = item => {
    const noDescr=strings("productDetail.noDescr");
    if (!item.descr) {
      return <Description>{noDescr}</Description>;
    }

    const regex = /(<([^>]+)>)/gi;

    const description = item.descr !== "null" ? item.descr.replace(regex, "") : noDescr;

    return <Description>{description}</Description>;
  };

  renderProductContent = item => {
    const { numOrdersProducts, properties } = this.props;

    const isOrderedEarlier = numOrdersProducts.some(
      el => el.id === this.state.product.id
    );
    const numOrder = isOrderedEarlier
      ? numOrdersProducts.find(el => el.id === this.state.product.id)
      : null;
    const num = isOrderedEarlier ? numOrder.numOrders : null;

    return (
      <ProductContent>
        <Text style={{ fontSize: 16 }}>{item.name}</Text>
        <Text style={{ fontSize: 18, fontWeight: "700"}}>{item.price} {item.currency.name}</Text>
        <NumOrdersProduct num={num} />
        <FlatList 
          extraData={this.state}
          data={properties}
          renderItem={this.renderProperties}
          keyExtractor={item => item.id}
        />
        {this.renderDescription(item)}
      </ProductContent>
    );
  };

  renderSum = () => {
    const { products, currencyId } = this.state;
    const product = products.find(prod => prod.id === this.state.product.id);

    if (!product.cartCount) return null;

    return (
      <View style={styles.buttons}>
        {
          currencyId === "1" ? (
            <Text style={{ fontSize: 20, fontWeight: "bold", paddingLeft: 20 }}>
              {`${this.getSum().toFixed(2)} USD`}
            </Text>
          ) : currencyId === "2" ? (
            <Text style={{ fontSize: 20, fontWeight: "bold", paddingLeft: 20 }}>
              {`${this.getSum().toFixed(2)} ₽`}
            </Text>
          ) : currencyId === "3" ? (
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
          text={strings("productDetail.addOrder")}
          fontSize="12"
          onPress={() => {
            this.props.navigation.goBack();
          }}
        />
      </View>
    );
  };

  renderMeasurableSum = () => {
    const { products } = this.state;
    const product = products.find(prod => prod.id === this.state.product.id);

    const productSum = product.cartCount ? (
      +product.cartCount *
      +product.price
    ).toFixed(2)
    : 0;

    const boxSum = this.state.value ? (
      +this.state.value * 
      +this.state.product.price * 
      +this.state.product.razmerme *
      +this.state.product.kratnost 
    ).toFixed(2)
    : 0;

    return (
      <MeasurableBottomContent>
        <MeasurableSum sum={productSum} />

        <MeasurableSum sum={boxSum} />
      </MeasurableBottomContent>
    );
  };

  render() {
    const { prices, loading } = this.props;
    const item = this.props.navigation.state.params.product;
    const priceId = this.props.navigation.state.params.priceId;
    const price = prices.find(price => price.id === priceId);

    const shopId = this.props.navigation.state.params.shopId;
    const group = prices.find(el => el.shop.id === shopId);
    const measurable = +this.state.product.ismerniy ? true : false;

    if (loading) {
      return <Spinner />;
    }

    return (
      <Animated.View
        style={[
          { flex: 1, height: "100%" },
          { transform: [{ translateY: this.state.shift }] }
        ]}
      >
        <ScrollView style={{flex:1,backgroundColor:'#fff'}}>
        { 
          group
            ? <PriceInfo>
                <GroupDetailPrice shop={group.shop} isViewed={true} />
              </PriceInfo>
            : price
            ? <PriceInfo>
                <Price date={price.date} shop={price.shop} isViewed={true}/>
              </PriceInfo>
            : null
        }

        {
          this.state.showImage && (
          <View>
            {this.renderImage(item, true)}

            <IconButton
              name={"ios-close-circle-outline"}
              onPress={() =>
                this.props.navigation.goBack()
              }
              stylesContainer={styles.iconClose}
              stylesIcon={{ color: colors.dataColor, fontSize: 18 }}
            />
          </View>
        )}

          <View style={{ paddingHorizontal: 10 }}>
            <Product>
              {this.renderImage(item,false)}
              {this.renderProductContent(item)}
              {this.renderCart(item)}
            </Product>
          </View>
        </ScrollView>
        {!measurable && this.renderSum()}
      </Animated.View>
    );
  }
}

ProductDetailScreen.navigationOptions = ({ navigation }) => ({
  headerTitle: () => ( <PriceDetailHeader title={navigation.state.params.title} /> ),
  headerStyle: {
    backgroundColor: colors.textColorPrimary,
    height: 80,
    // marginTop: Platform.OS==="ios" ? 20 : 0, 
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
  iconClose: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  cartTitle: {
    marginBottom: 10,
    fontWeight: "bold",
  },
  buttons: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor:colors.background,
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
