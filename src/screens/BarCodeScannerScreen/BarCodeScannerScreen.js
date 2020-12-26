import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  Alert,
  AsyncStorage,
  Platform,
  Image,
  Dimensions,
  Animated,
} from "react-native";

import * as Permissions from "expo-permissions";

import { BarCodeScanner } from "expo-barcode-scanner";

import { strings } from "../../../locale/i18n";
import { productSearchRequest, getShopInfoNetworkRequest } from "../../networkers";
import { SHOP_SEARCH_RESULT_SCREEN, SHOP_INFO_SCREEN, colors } from "../../constants";
import { PriceDetailHeader, IconButton, Spinner } from "../../components";

const { width } = Dimensions.get('window');
const windowHeight = Dimensions.get('window').height;
const qrSize = Platform.OS === "android" ? width * 0.77 : windowHeight > 667 ? width * 0.91 : width >= 375 ? width * 0.82 : width * 0.78;
const lineSize = Platform.OS === "android" ? width * 0.73 : width >= 375 ? width * 0.77 : width * 0.74;

export default class BarCodeScannerScreen extends React.Component {
  state = {
    hasCameraPermission: null,
    scanned: this.props.navigation.state.params.scanned,
    loading: false,
    userShopList: [],
    animation: new Animated.Value(0),
  };

  async componentDidMount() {
    this.getPermissionsAsync();
  }

  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  startAnimation = () => {
    Animated.sequence([
      Animated.timing(this.state.animation, {
        toValue: lineSize,
        duration: 3000,
      }),

      Animated.timing(this.state.animation, {
        toValue: Platform.OS === "android" ? 14 : windowHeight > 667 ? 48 : 8,
        duration: 3000,
      }),
    ],
    {
      useNativeDriver: true
    }
    ).start(this.startAnimation);
  };

  onSearch = async (code, shopId) => {
    const { navigation } = this.props;
    let userID = "";

    userID = await AsyncStorage.getItem("comironUserProfile");

    if (!code.length) return;

    this.setState({ loading: true });

    const res = await productSearchRequest(
      shopId,
      code,
      null,
      null,
    );
    const shop = res.shop;
    if (shop === null || shop === undefined) {
      Alert.alert(strings("QRScreen.noShop"));
      return;
    };

    let data = { products: [] };
    if (res.products.length) {
      data = res.products[0];
      delete data.shop;
    };

    this.setState({ loading: false });

    return navigation.navigate(SHOP_SEARCH_RESULT_SCREEN, {
      title: shop.name,
      products: data.products,
      isClick: this.props.isClick,
      shopId: shopId,
      personId: parseInt(userID),
      nextpage: res.nextpage,
      searchInput: code,
      currency: shop.currency,
      isControSklad: shop.iscontrolsklad,
      scanned: this.state.scanned,
    });
  };

  onShopSearch = async (value) => {
    const { userShopList } = this.state;

    const shop = await getShopInfoNetworkRequest(value);
    this.props.navigation.navigate(SHOP_INFO_SCREEN, { 
      userShopList: userShopList,
      shop: shop.shop,
      allShops: !userShopList.includes(shop.shop),
      scanned: this.state.scanned,
    });
  };

  handleBarCodeScanned = ({ data }) => {
    let temp = /searchpage/gi;
    let result = data.match(temp);

    if (result) {
      const str = data.split('/');
      const shopId = str[str.length-2];
      const code = str.pop();
      this.props.navigation.setParams({ scanned: true });
      this.setState({ scanned: true, textShow: false });
      this.onSearch(code, shopId);
    } else {
      const str = data.split('/').pop();
      this.props.navigation.setParams({ scanned: true });
      this.setState({ scanned: true, textShow: false });
      this.onShopSearch(str);
    };
  };

  onLayout = (e) => {
    this.setState({
      x: e.nativeEvent.layout.x,
      y: e.nativeEvent.layout.y,
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  };

  render() {
    const { hasCameraPermission, loading } = this.state;
    const { navigation } = this.props;
    const params = navigation.state.params;

    const transformStyle = {
      transform: [{
        translateY: this.state.animation,
      }]
    };

    if (loading) {
      return <Spinner />;
    };

    if (hasCameraPermission === null) {
      return <Text>{strings("QRScreen.permission")}</Text>;
    };
    if (hasCameraPermission === false) {
      return <Text>{strings("QRScreen.noPermission")}</Text>;
    };

    return (
      <View style={styles.container}>
        <BarCodeScanner
          onBarCodeScanned={params.scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.overlay}>
          <View style={styles.unfocusedContainer}></View>

          <View style={styles.middleContainer}>
            <View style={styles.unfocusedContainer}></View>
            <View
              onLayout={params.scanned ? undefined : this.startAnimation}
              style={styles.focusedContainer}
            >
              <Animated.View
                style={[
                  styles.animationLineStyle,
                  transformStyle,
                ]}
              />
              <Image 
                style={styles.qrFrame}
                source={require("../../../assets/focus1.png")}
              />
            </View>
            <View style={styles.unfocusedContainer}></View>
          </View>
          <View style={styles.unfocusedContainer}></View>
        </View>
      </View>
    );
  }
}

BarCodeScannerScreen.navigationOptions = ({ navigation }) => ({
  headerTitle: () => (
    <PriceDetailHeader
      title={strings("QRScreen.title")}
      color={colors.textColorPrimary}
    />
  ),
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
    borderBottomWidth: 0
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
  },

  middleContainer: {
    flexDirection: "row",
    flex: Platform.OS === "android" ? 3 : 2.5,
  },

  focusedContainer: {
    flex: Platform.OS === "android" ? 6.5 : windowHeight > 667 ? 20 : width >= 375 ? 9 : 7,
    borderRadius: 2,
  },
  arrowBack: {
    fontSize: 30,
    marginLeft: 25,
    color: "white",
    marginTop: Platform.OS === "android" ? 20 : windowHeight > 667 ? 0 : 15,
  },
  iosHeaderCenter: {
    height: "100%",
    alignItems: "center",
    marginBottom: 5
  },
  qrFrame: {
    flex: Platform.OS === "android" ? 9 : width >= 375 ? 12 : 10,
    width: qrSize,
    tintColor: "white",
    opacity: 0.6,
  },
  qrText : {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "20%",
  },
  againText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  fingerStyle: {
    width: 30,
    height: 30,
    alignSelf: "center",
    marginBottom: 20,
  },
  animationLineStyle: {
    height: 4,
    width: "100%",
    backgroundColor: colors.textColorPrimary,
    opacity: 0.7,
    shadowColor: colors.colorPrimary,
    shadowOffset: { width: 0, height: 100 },
    shadowOpacity: 0.9,
    shadowRadius: 3,
    elevation: 10,
  },
});