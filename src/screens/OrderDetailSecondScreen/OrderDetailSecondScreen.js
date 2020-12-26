import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Platform,
  Alert,
  Keyboard,
  Animated,
  Dimensions,
  UIManager,
  TouchableOpacity,
  ScrollView,
  Switch
} from "react-native";

import _ from "lodash";

import {
  Spinner,
  IconButton,
  PriceDetailHeader,
  CommentTextInputContainer,
  Sum,
  PhoneInputComponent,
  GroupDetailPrice,
  PriceInfo,
} from "../../components";
import {
  ContentWrapper,
  ProductImage,
} from "../OrderDetailScreen/components";
import {
  hostImages,
  colors,
  STANDARD_COMMENT_SCREEN,
  CART_SCREEN,
  PRICE_DETAIL_SCREEN,
  COOP_PRICE_DETAIL_SCREEN,
  SELECT_DELIVERY_SCREEN,
  SELECT_ADDRESS_SCREEN,
  SELECT_PAYMENT_SCREEN,
  SBERBANK_PAYMENT_SCREEN,
  GROUP_SCREEN,
} from "../../constants";

import { getCartSiteNetworkRequest, sendNewOrderNetworkRequest } from "../../networkers";
import notAvailable from "../../../assets/not-available.png";
import { strings } from "../../../locale/i18n";
import {
  getUserToken,
  getUserRefreshToken,
  saveUserPhone,
  deleteUserPhone,
  getUserPhone,
} from "../../utils";

const deliveryTypes = {
  dpd: "DPD",
  russiapost: "Почта России",
  kurer: "Курьер",
  manager: "Согласовать индивидуально",
  pointofissue: "Пункт выдачи"
};

const { State: TextInputState } = TextInput;

const windowHeight = Dimensions.get('window').height;

export default class OrderDetailSecondScreen extends PureComponent {
  constructor(props) {
    super();
    this.state = {
      products: props.navigation.state.params.products,
      selected: props.navigation.state.params.selected,
      shift: new Animated.Value(0),
      phoneNumber: "",
      comment: "",
      shopId: props.navigation.state.params.shopId,
      shop: props.navigation.state.params.shop,
      price_id: props.navigation.state.params.price_id ? props.navigation.state.params.price_id : "",
      currencyId: props.navigation.state.params.currencyId,
      isControlSklad: props.navigation.state.params.isControlSklad,
      loading2: false,
      shopInfo: props.navigation.state.params.shopInfo,
      flag: props.navigation.state.params.flag,
      phoneRequire: props.navigation.state.params.phoneRequire,
      noPhone: false,
      userPhone: "",
      saved: props.navigation.state.params.saved,
      is_sz: props.navigation.state.params.is_sz ? props.navigation.state.params.is_sz : "0",
      // Delivery and Payment
      dpdAddressInput: null,
      paymentType: "",
      shop_id: "",
      deliveryType: "",
      payLater: true,
      volume: 0,
      weight: 0,
      w: 0,
      h: 0,
      pickup_address: "",
      deliverycost: 0,
      deliveryFreeCost: null,
      q: "",
      dpddeliverytype: "",
      address: null,
      paymentm: "",
      poiAddress: null,
      cityid: null,
      dpddeliverytype: null
    };
  }
  async componentDidMount() {
    const { shopId } = this.state;
    const selected = [];

    this.setState({ loading2: true });

    const phone = await getUserPhone();

    const token = await getUserToken();
    const refreshToken = await getUserRefreshToken();

    await this.props.getCart(shopId, token, refreshToken);

    const productFilter = this.state.products.map(product => product.id);
    const productFiltered = this.props.cartSite.filter(product => !productFilter.includes(String(product.id)));
    const newCart = productFiltered.concat(this.state.products);
    this.setState({ products: newCart, userPhone: phone });

    this.state.products.forEach(el => {
      if (el.cartCount && el.shop_id === this.state.shopId) selected.push(el.id);
    });
    this.setState({ selected });

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
    }
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
        const gap = (windowHeight - keyboardHeight - (fieldTop + fieldHeight)) * 1.25;
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

  getSum = () => {
    const { products, selected, is_sz } = this.state;

    const szProducts = this.props.navigation.state.params.products;
    const filterProducts = is_sz === "1"
      ? szProducts.filter(product =>
        selected.some(select => select === product.id)
      )
      : products.filter(product =>
        selected.some(select => select === product.id)
      );
    const sum = filterProducts.reduce(
      (sum, item) => sum + Number(item.cartCount) * item.price,
      0
    );

    if (this.state.deliverycost > 0) {

      if (
        ['kurer', 'pointofissue'].includes(this.state.deliveryType) &&
        sum >= this.state.deliveryFreeCost
      ) return sum

      return sum + +this.state.deliverycost;
    }

    return sum;
  };

  // need to fix the "source" variable:
  // there should be "price" || "group" || "search" values,
  // for now it's only "price"
  sendOrder = async () => {
    const {
      shopId,
      isControlSklad,
      token,
      refreshToken,
      comment,
      phoneNumber,
      phoneRequire,
      userPhone,
    } = this.state;
    const { navigation, savedComment } = this.props;
    let currentAdress = this.state.address ? this.state.address.id : "";
    const shopCommentArr = savedComment ? savedComment.filter(el => el.shopId === shopId) : [];
    const shopCommentObj = shopCommentArr ? shopCommentArr[shopCommentArr.length - 1] : "";

    const checkCount = this.state.products.filter(el => +el.sklad < +el.cartCount && el.shop_id === shopId);

    if (isControlSklad === "1" && checkCount.length !== 0) {
      Alert.alert(strings("priceDetail.noItemOrder"), strings("priceDetail.noItemOrderSub"), [
        { text: strings("priceDetail.ok")}
      ]);
      checkCount.forEach(el => {
        const newProduct = {
          ...el,
          inputColor: true,
        };
        const index = this.state.products.findIndex(product => product.id === el.id);
        const newProducts = this.state.products;
        newProducts.splice(index, 1, newProduct);
        this.setState({ products: newProducts });
      });
    } else {
      this.setState({ loading2: true });

      const savedPhone = userPhone === null ? "" : userPhone;

      const shop_id = shopId;
      const comment_person = shopCommentObj ? shopCommentObj.comment : comment;
      const phone = phoneNumber;

      const res = await getCartSiteNetworkRequest(shopId, token, refreshToken);
      const products = this.state.products
        .filter(el => el.shop_id === shopId)
        .map(el => ({
          numberProductId: +el.id
        }));
      const order = { products };

      if (phoneRequire == 1 && (!savedPhone && !phone)) {
        this.setState({ loading2: false, noPhone: true });
        Alert.alert(strings("cartScreen.denied"), strings("cartScreen.needPhone"));
        return;
      }

      const newOrder = {
        shop_id: this.state.shop.id,
        price_id: this.state.price_id,
        volume: this.state.volume,
        weight: this.state.weight,
        w: this.state.w,
        h: this.state.h,
        pickup_address: res.shop_addresses ? res.shop_addresses[0].id : "",
        deliverycost: this.state.deliverycost,
        delivery: this.state.deliveryType,
        q: this.state.deliveryType === 'dpd' && this.state.dpdAddressInput,
        cityid: this.state.cityid,
        dpddeliverytype: this.state.dpddeliverytype,
        address: this.state.deliveryType === 'pointofissue'
          ? this.state.poiAddress
          : currentAdress,
        phone,
        comment_person,
        paymentm: this.state.paymentType.length > 0 ? "sber" : "",
        later: this.state.payLater,
        is_sz: this.state.is_sz
      };
      
      if (this.state.paymentType.length > 0 && !this.state.payLater) {
        this.setState({ loading2: false });
        this.props.navigation.navigate(SBERBANK_PAYMENT_SCREEN, {
          newOrder
        });
        return;
      }

      await sendNewOrderNetworkRequest(newOrder, order);
      // await this.props.newOrderSend(shop_id, comment_person, phone, order, token, refreshToken);
      await saveUserPhone(phone ? phone : savedPhone);
      await this.props.addCartLength();
      this.setState({ noPhone: false, userPhone: phone ? phone: savedPhone, loading2: false });
      Alert.alert(strings("priceDetail.orderComplete"), "", [
        { text: strings("priceDetail.ok"), onPress: () => {
          if (navigation.state.params.fromPrice) {
            navigation.navigate(PRICE_DETAIL_SCREEN);
            navigation.state.params.onSelectedClear();
          } else if (navigation.state.params.fromGroup) {
            navigation.navigate(GROUP_SCREEN);
            navigation.state.params.onSelectedClear();
          } else if (navigation.state.params.fromSZ) {
            navigation.navigate(COOP_PRICE_DETAIL_SCREEN);
            navigation.state.params.onSelectedClear();
          }
            else {
            navigation.navigate(CART_SCREEN);
            navigation.state.params.onCartRefresh();
          };
        }}
      ]);

      this.state.selected = [];
    };
  };

  setDeliveryFields = fields => this.setState(fields);

  renderImage = item => {
    if (item.thumbnail_url) {
      return (
        <ProductImage source={{ uri: `${hostImages}${item.thumbnail_url}` }} />
      );
    }

    return <ProductImage source={notAvailable} />;
  };

  HeaderComponent = (price, shop) => (
    <PriceInfo>
        <GroupDetailPrice shop={price ? price.shop : shop} isViewed={true}/>
    </PriceInfo>
  );
 
  addStandardComment = props => {
    const { shopId } = this.state;
    const { savedComment } = this.props;

    const comment = props.comment;
    let commentArr = [];

    if (savedComment.length) {
      const shopCommentArr = savedComment.filter(el => el.shopId === shopId);
      const shopCommentObj = shopCommentArr ? shopCommentArr[shopCommentArr.length - 1] : {};

      const newShopCommentObj = {
        comment: shopCommentObj ? shopCommentObj.comment + "\n" + comment : comment,
        shopId: shopId,
      };

      commentArr.push(newShopCommentObj);

      this.setState({ comment: shopCommentObj ? shopCommentObj.comment + "\n" + comment : comment });
      this.props.saveComment(commentArr);
    } else {
      const commentObj = {comment, shopId};
      commentArr.push(commentObj);
      this.props.saveComment(commentArr);
    }
  };

  saveOrderComment = (comment) => {
    this.props.saveComment(comment);
  };

  deletePhone = async () => {
    this.setState({ userPhone: "" });
    await deleteUserPhone();
  };

  renderOrder = () => {
    const { comment, noPhone, userPhone, shopId } = this.state;
    const { savedComment } = this.props;

    const shopCommentArr = savedComment ? savedComment.filter(el => el.shopId === shopId) : [];
    const shopCommentObj = shopCommentArr ? shopCommentArr[shopCommentArr.length - 1] : "";

    return (
      <Animated.View
        style={[
          { flex: 1, height: "100%", paddingTop: 10 },
          { transform: [{ translateY: this.state.shift }] }
        ]}
      >
        <ScrollView>
          <PhoneInputComponent
            placeholder={strings("cartScreen.phone")}
            phone={userPhone}
            keyboardType="phone-pad"
            onChange={phoneNumber => this.setState({ phoneNumber })}
            deletePhone={this.deletePhone}
            maxLength={12}
            error={noPhone}
          />
          <View
            style={{
              paddingLeft: 15,
              paddingTop: 5,
              paddingBottom: 5,
              flexDirection: "row",
              flexWrap: "wrap"
            }}
          >
            <Text style={styles.commentText}>{strings("priceDetail.comment")}</Text>
            <TouchableOpacity
              style={{ marginLeft: 25 }}
              onPress={() => {
              this.props.navigation.navigate(STANDARD_COMMENT_SCREEN, {
                fromOrder: true,
                addStandardComment: this.addStandardComment,
              })}}
            >
              <Text style={styles.buttonNavComment}>{strings("profile.goToStandardComment")}</Text>
            </TouchableOpacity>
            <Text style={styles.commentText}>{this.state.shop.comment_description}</Text>
          </View>

          <CommentTextInputContainer>
            <TextInput
              style={{ height: 160, textAlignVertical: "top" }}
              multiline
              fontSize={16}
              onChangeText={comment => {
                const commentObj = {comment, shopId}
                let commentArr = [];
                commentArr.push(commentObj)
                this.setState({ comment });
                this.saveOrderComment(commentArr);
              }}
              onEndEditing={object => {
                const comment = object.nativeEvent.text;
                if (!comment) {
                  this.saveOrderComment("");
                }
              }}
              value={shopCommentObj ? shopCommentObj.comment : comment}
              blurOnSubmit
            />
          </CommentTextInputContainer>

          {this.renderSelectAddress()}
          {this.renderSelectDeliveryType()}
          {this.renderSelectPaymentType()}
          {this.renderPayLater()}
        </ScrollView>
      </Animated.View>
    );
  };

  sendOrderButton = () => {
    const isOrderValid = this.validateOrder();
    const isBtnDisabled = isOrderValid ? false : true;

    return (
      <View style={{ flex: 0, justifyContent: "flex-end" }}>
        <Sum
          disabled={isBtnDisabled}
          currencyId={this.state.currencyId}
          value={this.getSum()}
          sendOrder={this.sendOrder}
        />
      </View>
    );
  };

  renderSelectDeliveryType = () => {
    return(
      <>
        <View style={styles.sectionItem}>
          <Text style={{ fontWeight: "bold", fontSize: 17}}>
            {strings("cartScreen.delivery")}
          </Text>
          <TouchableOpacity
            style={{ marginLeft: 25 }}
            onPress={() => this.props.navigation.navigate(
              SELECT_DELIVERY_SCREEN,
              {
                shop: this.state.shop,
                userAddress: this.state.address,
                setDeliveryFields: this.setDeliveryFields
              }
            )}
          >
            <Text style={styles.buttonNavComment}>{strings("cartScreen.choose")}</Text>
          </TouchableOpacity>
        </View>
        
        {this.state.deliveryType.length > 0 &&
          <View style={styles.deliveryContainer}>
            <Text style={styles.deliveryText}>
              {deliveryTypes[this.state.deliveryType]}
            </Text>

            {this.state.deliverycost > 0 &&
              <Text style={styles.deliveryText}>
                {strings("cartScreen.deliveryCost")} {this.state.deliverycost} {strings("cartScreen.currency")}
              </Text>
            }
          </View>
        }
      </>
    );
  };

  renderSelectPaymentType = () => {
    if (!this.state.shop.paysber || this.state.shop.proofSBER != 1) return null;

    return(
      <>
        <View style={styles.sectionItem}>
          <Text style={{ fontWeight: "bold", fontSize: 17 }}>
            {strings("cartScreen.payment")}
          </Text>
          <TouchableOpacity
            style={{ marginLeft: 25 }}
            onPress={() => this.props.navigation.navigate(SELECT_PAYMENT_SCREEN, {
              setDeliveryFields: this.setDeliveryFields
            })}
          >
            <Text style={styles.buttonNavComment}>{strings("cartScreen.choose")}</Text>
          </TouchableOpacity>
        </View>
        {this.state.paymentType.length > 0 &&
          <View style={styles.deliveryContainer}>
            <Text style={styles.deliveryText}>{this.state.paymentType}</Text>
          </View>
        }
      </>
    );
  };

  renderSelectAddress = () => {
    return(
      <>
        <View style={styles.sectionItem}>
          <Text style={{ fontWeight: "bold", fontSize: 17 }}>{strings("cartScreen.adress")} </Text>
          <TouchableOpacity
            style={{ marginLeft: 25 }}
            onPress={() => this.props.navigation.navigate(SELECT_ADDRESS_SCREEN, {
              shop: this.state.shop,
              setUserAddress: this.setUserAddress
            })}
          >
            <Text style={styles.buttonNavComment}>{strings("cartScreen.choose")}</Text>
          </TouchableOpacity>
        </View>

        {this.state.address &&
          <View style={styles.deliveryContainer}>
            <Text style={styles.deliveryText}>{this.state.address.addrstring}</Text>
          </View>
        }
      </>
    );
  };

  renderPayLater = () => {
    const SwitchProps = {
      ...Platform.select({
        ios: {
          trackColor: { true: colors.colorPrimary },
          // ios_backgroundColor: colors.colorPrimary
        },
        android: {
          trackColor: { true: colors.colorPrimary },
          thumbColor: "lightgray"
        }
      })
    };

    return(
      <View style={[styles.sectionItem, { alignItems: "center" }]}>
        <Text style={{ marginRight: 10 }}>
          {strings("cartScreen.payLater")}
        </Text>
        <Switch
          value={this.state.payLater}
          onValueChange={() => this.setState({ payLater: !this.state.payLater })}
          {...SwitchProps}
        />
      </View>
    );
  };

  validateOrder = () => {
    if (this.state.payLater) return true;
    return this.state.deliveryType === 'dpdru' && this.state.cityid ||
      this.state.deliveryType === 'rupost'&& this.state.weight < 20 ||
      this.state.deliveryType.length > 0 ||
      !!this.state.shop.no_delivery_order;
  }

  setUserAddress = address => this.setState({ address });
  setDeliveryType = type => this.setState({ deliveryType: type });

  render() {
    const { loading, prices } = this.props;
    const { loading2, shop } = this.state;
    const priceId = this.props.navigation.state.params.price_id;
    const price = prices.find(price => price.id == priceId);

    if (loading || loading2) {
      return <Spinner />;
    }

    return (
      <>
        {
          shop.comment_description ? (
              <ContentWrapper>
                {this.HeaderComponent(price, shop)}
                {this.renderOrder()}
                {this.sendOrderButton()}
              </ContentWrapper>
          ) : (
            <ContentWrapper>
              {this.HeaderComponent(price, shop)}
              {this.renderOrder()}
              {this.sendOrderButton()}
            </ContentWrapper>
          )
        }
      </>
    );
  };
}

OrderDetailSecondScreen.navigationOptions = ({ navigation }) => ({
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
  sectionItem: {
    paddingLeft: 15,
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 5,
    flexDirection: "row",
    flexWrap: "wrap"
  },

  deliveryHeader: {},

  deliveryText: {
    fontSize: 16
  },

  deliveryContainer: {
    paddingHorizontal: 10,
    justifyContent: "center",
    marginHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 5,
    height: 80,
    marginBottom: 10
  }
});