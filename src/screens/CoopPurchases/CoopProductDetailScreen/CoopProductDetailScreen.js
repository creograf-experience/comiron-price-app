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
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import { Button } from "../../../containers";
import {
  IconButton,
  PriceDetailHeader,
  PriceInfo,
  CoopPrice,
  CoopTimerPrice,
  ProductContent,
  CartContainer,
  CartTextInputContainer,
  AddToCart,
  Spinner,
  CoopNumOrdersProduct,
  NewBigImage,
} from "../../../components";
import {
  ContentWrapper,
  ProductImage,
  Description,
  Product,
  MeasurableBottomContent,
  MeasurableSum,
} from "../../ProductDetailScreen/components";
import {
  hostImages,
  COOP_PRICE_DETAIL_SCREEN,
  colors,
} from "../../../constants";

import { getTimeUntilEnddate } from '../../../utils';

import notAvailable from "../../../../assets/not-available.png";
import SwiperFlatList from 'react-native-swiper-flatlist';
import { strings } from "../../../../locale/i18n";

const { State: TextInputState } = TextInput;

const windowHeight = Dimensions.get('window').height;

export default class CoopProductDetailScreen extends Component {
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

  changeCartCountRazmerme=(value, item)=>{
    this.props.navigation.state.params.changeCartCountRazmerme(value, item);
    this.setState({ product: item });
  }

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
    }

    this.setState({ value: String(+this.state.value - val) });
  };

  getSum = () => {
    const { products } = this.state;
    const product = products.find(prod => prod.id === this.state.product.id);
    const productSum = product.cartCount
      ? Number(product.cartCount) * product.price
      : 0;
    return productSum;
  };

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
    const { prices } = this.props;
    const measurable = +this.state.product.ismerniy ? true : false;
    const { products } = this.state;
    const product = products.find(prod => prod.id === this.state.product.id);

    const priceId = this.props.navigation.state.params.priceId;
    const price = prices.find(price => price.id === priceId);

    const { milliseconds } = getTimeUntilEnddate(+price.enddate);

    if(milliseconds < 0) return; // if coop has ended => no cart
    
    if (product.cartCount) {
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
                  onBlur={value => { this.changeCartCountRazmerme(value,product), this.setState({ showImage: true }) }}
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
            source={require("../../../../assets/cart.png")}
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
          <Text style={styles.cartTitle}>{strings("productDetail.pack")}</Text>

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
                  style={{ fontSize: 18, fontWeight: "bold" }}
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

  renderDescription = item => {
    const noDescr = strings("productDetail.noDescr");

    if (!item.descr) {
      return <Description>{noDescr}</Description>;
    }

    const regex = /(<([^>]+)>)/gi;

    const description =
      item.descr !== "null" ? item.descr.replace(regex, "") : noDescr;

    return <Description>{description}</Description>;
  };

  renderProductContent = item => {

    const { numOrdersProducts } = this.props;

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
        <CoopNumOrdersProduct tobuy={item.tobuy} num_orders_sz={item.num_orders_sz}/>
        {this.renderDescription(item)}
      </ProductContent>
    );
  };

  renderSum = () => {
    const { products } = this.state;
    const product = products.find(prod => prod.id === this.state.product.id);
    const filterOtherProducts = products.filter(el => {
      if (el.cartCount && el.id !== product.id) return el;
    });
    if (!product.cartCount) return null;

    return (
      <View style={styles.buttons}>
        {
          this.state.currencyId === "1" ? (
            <Text style={{ fontSize: 20, fontWeight: "bold", paddingLeft: 20}}>
              {`${this.getSum().toFixed(2)} USD`}
            </Text>
          ) : this.state.currencyId === "2" ? (
            <Text style={{ fontSize: 20, fontWeight: "bold", paddingLeft: 20}}>
              {`${this.getSum().toFixed(2)} ₽`}
            </Text>
          ) : this.state.currencyId === "3" ? (
            <Text style={{ fontSize: 20, fontWeight: "bold", paddingLeft: 20}}>
              {`${this.getSum().toFixed(2)} EUR`}
            </Text>
          ) : (
            <Text style={{ fontSize: 20, fontWeight: "bold", paddingLeft: 20}}>
              {`${this.getSum().toFixed(2)} RMB`}
            </Text>
          ) 
        }
        <Button
          text={strings("productDetail.addOrder")}
          onPress={() => {
            this.props.navigation.navigate(COOP_PRICE_DETAIL_SCREEN);
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
    
    const measurable = +this.state.product.ismerniy ? true : false;

    if (loading) {
      return <Spinner />;
    }

    const {
      milliseconds,
      daysLeft,
    } = getTimeUntilEnddate(+price.enddate);

    return (
      <Animated.View
        style={[ styles.itemContainer, { flex: 1, height: "100%" }, { transform: [{ translateY: this.state.shift }] } ]}
      >
        <ContentWrapper>{
          <PriceInfo>
          {
            daysLeft > 0
              ? <CoopPrice name={price.name} date={price.enddate} shop={price.shop} isViewed={true}/>
              : milliseconds < 0
                ? <CoopPrice name={price.name} date={price.enddate} shop={price.shop} isViewed={true}/>
                : <CoopTimerPrice name={price.name} date={price.enddate} shop={price.shop} isViewed={true}/>
          }
          </PriceInfo>}


            {this.state.showImage && (
              <View>
                {this.renderImage(item, true)}

                <IconButton
                  name={"close-circle-outline"}
                  onPress={() =>
                    this.props.navigation.navigate(COOP_PRICE_DETAIL_SCREEN)
                  }
                  stylesContainer={styles.iconClose}
                  stylesIcon={{ color: colors.dataColor }}
                />
              </View>
            )}
            <View style={{ paddingHorizontal: 10 }}>
              <Product>
                {this.renderImage(item)}
                {this.renderProductContent(item)}
                {this.renderCart(item)}
              </Product>
          </View>
        </ContentWrapper>
        {!measurable && this.renderSum()}
      </Animated.View>
    );
  }
}

CoopProductDetailScreen.navigationOptions = ({ navigation }) => ({
  headerTitle: () => <PriceDetailHeader title={navigation.state.params.title} />,
  headerStyle: {
    height: 80,
    backgroundColor: colors.textColorPrimary,
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
    backgroundColor: colors.background,
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
});
