import React, { PureComponent } from "react";
import {
  View,
  ScrollView,
  Alert,
} from "react-native";
import { colors, SHOP_INFO_SCREEN, PRODUCT_DETAIL_SCREEN } from "../../constants";
import { strings } from "../../../locale/i18n";
import {
  HeaderRightButton,
  HeaderLeftButton,
  PriceDetailHeader,
  Spinner,
  DefaultSearchBar,
} from "../../components";
import { ItemList } from "./components/ItemList";
import { ContainerList } from "./components/ContainerList";
import { Carousel } from './components/Carousel';
import {currentLocale} from "../../../locale/i18n";
import data from "../../../app.json";
import { host } from "../../constants";
import { getUserToken, getUserRefreshToken, storeDataCommunity, getDataCommunity } from "../../utils";

const API_KEY = data.expo.android.config.googleMaps.apiKey;
const API_URL = "https://maps.googleapis.com/maps/api/geocode/json?";

class RecShopsScreen extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      shops: null,
      city: null,
      banners: null,
      userShops: [],
      value: null,
      allShopsList: [],
      cityShops: null,
      cityShopsLoaded: false,
    };
  }

  fetchCity(lat, lon) {
    const url = API_URL +
          "latlng=" + lat + "," + lon +
          "&key=" + API_KEY +
          "&language=" + currentLocale;

    fetch(url)
    .then(res => res.json())
    .then(res => {
      let isCity = false;
      res["results"].map(item => {
        if (item.types.includes("locality") && item.types.includes("political")) {
          isCity = true;
          this.setState({
            city: item.address_components[0].long_name,
          }, this.props.getAllCityShops(item.address_components[0].long_name));
        }
      });
      if (!isCity) {
        this.setState({
          city: "NOT"
        })
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  shuffleArray(oldArr) {
    let arr = [...oldArr];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  fetchBanners() {
    fetch(host + "/central/banners")
    .then(res => res.json())
    .then(res => {
      let banners = this.shuffleArray(res.banners);
      this.setState({
        banners: banners
      });
    })
    .catch(err => {
      console.log(err);
    });
  }

  async componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.fetchCity(position.coords.latitude, position.coords.longitude);
        },
        error => {
          console.log(error.message);
          this.setState({
            city: "NOT"
          });
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    } else {
      this.setState({
        city: "NOT"
      });
    }

    getDataCommunity("cityShops")
    .then(cityShops => {
      if (cityShops) {
        this.setState({
          cityShops: cityShops,
          cityShopsLoaded: true,
        })
      }
    })
    .catch(error => {
      console.log(error);
    });

    this.fetchBanners();

    this.props.getUserShops();

    this.props.getAllShops();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error !== prevProps.error) {
      console.log(this.props.error);
    }

    if (this.props.userShops && this.props.userShops !== prevProps.userShops) {
      this.setState({ userShops: this.props.userShops.shops });
    }

    if (this.props.shopsSearch && this.props.shopsSearch !== prevProps.shopsSearch) {
      this.setState({ allShopsList: this.props.shopsSearch.results });
    }

    if (this.props.cityShops
      && this.props.cityShops !== prevProps.shopsSearch
      && this.props.cityShops !== this.state.cityShops) {
      this.setState({
        cityShops: this.props.cityShops.shops,
        cityShopsLoaded: true,
      });
      storeDataCommunity("cityShops", this.props.cityShops.shops)
    }

    if (this.props.shops !== prevProps.shops) {
      if (this.props.fetching) {
        return;
      }

      if (this.props.status === "got+") {
        this.setState({
          shops: {
            recommended: this.props.shops.recommended.malls,
            products: this.props.shops.products.products,
          },
          loading: false,
        });
      }
    }
  }

  addToCart = async (id) => {
    const product = this.state.shops.products.find(product => product.id === id);
    const token = await getUserToken();
    const refreshToken = await getUserRefreshToken();
    const valkr = +product.razmerme ? product.razmerme : "1";

    if (product.sklad > 0) {

      await this.props.addItemSite(
        product.id,
        valkr,
        product.price_id ? product.price_id : "",
        "price",
        token,
        refreshToken,
      );

      await this.props.addCartLength();

      Alert.alert(strings("recShopsScreen.inCart"), "", [
        { text: strings("priceDetail.ok") }
      ]);

    } else {
      Alert.alert(strings("priceDetail.noItem"), "", [
        { text: strings("priceDetail.ok") }
      ]);
    }
  }

  renderItemShops = ({ item}) => {
    return (
      <ItemList
        item={item}
        goToItemInfo={this.goToShopInfo}
      />
    )
  };

  renderItemProducts = ({ item }) => {
    return (
      <ItemList
        item={item}
        goToItemInfo={this.goToProductInfo}
      />
    )
  };

  isUserShop = (shop, userShops) => {
    userShops.forEach(userShop => {
      if (userShop.id === shop.id) {
        return true;
      }
    });
    return false;
  }

  goToShopInfo = shop => {
    const { navigate } = this.props.navigation;

    navigate(SHOP_INFO_SCREEN,{
      shop: shop,
      userShopList: this.state.userShops,
      allShops: !this.isUserShop(shop, this.state.userShops),
      fromPrice: false,
      fromRecShops: true,
      saved: false,
    });
  };

  goToProductInfo = product => {
    const { navigate } = this.props.navigation;

    navigate(PRODUCT_DETAIL_SCREEN,{
      product: product,
      products: [product],
      currencyId: product.currency_id,
      shopId: product.shop_id,
      addToCart: this.addToCart,
      priceId: "",
    });
  };

  viewShop = link => {
    if (link !== "/") {
      fetch(host + link)
      .then(res => res.json())
      .then(res => {
        this.goToShopInfo(res.shop);
      })
      .catch(err => {
        console.log(err);
      });
    }
  }

  searchFilterFunction = text => {
    this.setState({ value: text });

    const newData = this.state.allShopsList.filter((item) => {
      const itemData = `${item.name.toUpperCase()}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });

    this.setState({ allShopsList: newData });
  };

  searchShop = () => {
    const { getAllShopsSearch } = this.props;
    const { value } = this.state;

    getAllShopsSearch(value);
  };

  render() {
    const {
      loading,
      banners,
      value,
      allShopsList,
      cityShops,
      cityShopsLoaded,
      city,
    } = this.state;
    return (
      !banners
        ? <Spinner />
        : (
          <ScrollView
            style={{ flex: 1, backgroundColor: colors.background }}
            nestedScrollEnabled={true}>

            <DefaultSearchBar
              placeholderText={strings("recShopsScreen.search")}
              value={value}
              onChangeText={text => this.searchFilterFunction(text)}
              onEndEditing={this.searchShop}
              onClear={() => this.setState({ allShopsList: [] })}
            />

            <Carousel items={banners} viewShop={this.viewShop} />

            {allShopsList.length > 0 &&
              <ContainerList
                headerText={strings("recShopsScreen.resSearch")}
                textNoItem={strings("recShopsScreen.recSupplierNot")}
                data={allShopsList}
                renderItem={this.renderItemShops}
                vertical={false}
              />
            }

            {city === 'NOT' ?
              <ContainerList
                headerText={strings("recShopsScreen.recSupplierNearby")}
                textNoItem={strings("recShopsScreen.recSupplierNearbyNot")}
                data={[]}
                renderItem={this.renderItemShops}
                vertical={false}
              /> :
              cityShopsLoaded ?
              <ContainerList
                headerText={strings("recShopsScreen.recSupplierNearby")}
                textNoItem={strings("recShopsScreen.recSupplierNearbyNot")}
                data={cityShops}
                renderItem={this.renderItemShops}
                vertical={false}
              /> :
              (<View style={{ margin: 30, padding: 30 }}><Spinner/></View>)
            }

            {
              loading
              ? (
                <View style={{ margin: 30, padding: 30 }}><Spinner/></View>
              ) :
              (
                <View>
                  <ContainerList
                    headerText={strings("recShopsScreen.recSupplier")}
                    textNoItem={strings("recShopsScreen.recSupplierNot")}
                    data={this.state.shops && this.state.shops.recommended ? this.state.shops.recommended : []}
                    renderItem={this.renderItemShops}
                    vertical={false}
                  />

                  <ContainerList
                    headerText={strings("recShopsScreen.products")}
                    textNoItem={strings("recShopsScreen.productsNot")}
                    data={this.state.shops && this.state.shops.products ? this.state.shops.products : []}
                    renderItem={this.renderItemProducts}
                    vertical={true}
                  />
                </View>
              )
            }

          </ScrollView>
        )
    );
  }
}

RecShopsScreen.navigationOptions = ({ navigation }) => ({
  headerStyle: {
    backgroundColor: colors.colorPrimary,
    height: 80,
    shadowColor: "transparent",
    shadowRadius: 0,
    shadowOffset: {
      height: 0,
    },
    elevation: 0,
    borderBottomWidth: 0,
  },
  headerTintColor: colors.textColorPrimary,
  headerTitle: () => ( <PriceDetailHeader
    title={strings("recShopsScreen.supplier")}
    color={colors.textColorPrimary}
  /> ),
  headerRight: () => ( <HeaderRightButton navigation={navigation} /> ),
  headerLeft: () => ( <HeaderLeftButton navigation={navigation} isBackgroundWhite={true} /> ),
});

export default RecShopsScreen;
