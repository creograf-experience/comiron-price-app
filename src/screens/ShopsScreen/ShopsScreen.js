import React, { PureComponent } from "react";
import {
  View,
  AsyncStorage,
  Platform,
  SectionList,
  Text,
  StyleSheet,
  Dimensions
} from "react-native";

import {
  PriceDetailHeader,
  Spinner,
  DefaultSearchBar,
  HeaderRightButton,
  IconButton
} from "../../components";
import { colors, SHOP_INFO_SCREEN } from "../../constants";
import { ShopList } from "./containers";
import { Separator } from "../MainScreen/components";
import { scale } from "react-native-size-matters";
import { strings } from "../../../locale/i18n";

class ShopsScreen extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      loading: true,
      userShopsTabTapped: true,
      shops: null,
      value: null,
      userShopList: [],
      allShopsList: [],
      allShops: [],
      names: [],
    };

    this.arrayholder = [];
  }

  componentDidMount() {
    this.props.showAllShops();
    this.getUserId();
  }

  componentDidUpdate(prevProps) {
    if (this.props.shops !== prevProps.shops) {
      if (this.props.fetching) {
        return;
      }

      if (this.props.status === "got") {
        this.setState({
          shops: this.props.shops,
          userShopList: this.props.shops.shops,
          loading: false,
        }, this.addName);
        this.arrayholder = this.props.shops.shops;
      }
      if (this.props.status === "got+") {
        this.setState({
          allShops: this.props.shops.results,
        }, this.filterShops);
      }

      if (this.props.error) {
        alert(this.props.error);
      }
    }
  }

  getUserId = async () => {
    const { getUserShops } = this.props;
    let userID = "";
    try {
      userID = await AsyncStorage.getItem("comironUserProfile");
    } catch (error) {
      // Error retrieving data
    }
    this.setState({ userID });
    getUserShops(parseInt(userID));
  };

  addName = () => {
    const { userShopList } = this.state;
    let names = [];

    userShopList.map(shop => names.push(shop.name));

    this.setState({ names })
  };

  filterShops = () => {
    const { allShops, names } = this.state;
    let allShopsList = allShops ? allShops.filter(shop => !names.includes(shop.name)) : [];

    this.setState({ allShopsList })
  };

  onRefresh = () => {
    if (this.state.userShopsTabTapped) {
      this.setState({ refreshing: true }, this.handleRefresh);
    }
  };

  handleRefresh = () => {
    const { getUserShops } = this.props;
    const { userID } = this.state;

    getUserShops(parseInt(userID));

    this.setState({ refreshing: false })
  };

  renderItem = ({ item }) => {
    return (
      <ShopList
        shop={item}
        userShopsTabTapped={this.state.userShopsTabTapped}
        goToShopInfo={this.goToShopInfo}
      />
    )
  };

  goToShopInfo = shop => {
    const { navigate } = this.props.navigation;

    navigate(SHOP_INFO_SCREEN, {
      userShopList: this.state.userShopList,
      shop: shop,
      allShops: !this.state.userShopList.includes(shop),
      fromPrice: false,
      fromShop: true,
      saved: false,
    });
  };

  searchFilterFunction = text => {
    this.setState({ value: text });

    const newData = this.arrayholder.filter((item) => {
      const itemData = `${item.name.toUpperCase()}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    this.setState({ userShopList: newData });
  };

  searchShop = () => {
    const { getAllShops } = this.props;
    const { value } = this.state;

    getAllShops(value)
  };

  renderSearchBar = () => {
    const { value } = this.state;

    return (
      <DefaultSearchBar
        placeholderText={strings("shopsScreen.search")}
        value={value}
        onChangeText={text => this.searchFilterFunction(text)}
        onEndEditing={this.searchShop}
        onClear={() => this.setState({ allShopsList: [] })}
      />
    );
  };

  render() {
    const { loading, userShopList, allShopsList, refreshing, value } = this.state;

    return (
      loading
        ? <Spinner />
        : (
          <View style={{ flex: 1, backgroundColor: colors.background }}>
            {this.renderSearchBar()}
            <SectionList
              removeClippedSubviews={false}
              renderItem={this.renderItem}
              renderSectionHeader={({section: {title}}) => {
                return (title && (
                  <View style={{ height: scale(35), backgroundColor: colors.background, justifyContent: "center" }}>
                    <Text style={{ fontWeight: "bold", fontSize: 18, marginLeft: scale(10) }}>{title}</Text>
                  </View>
                  )
                )
              }}
              sections={[
                {
                  title: userShopList.length === 0
                    ? null
                    : strings("shopsScreen.mySupp"), data: userShopList
                },
                {
                  title: allShopsList.length === 0 || value === ""
                    ? null
                    : strings("shopsScreen.resSearch"), data: value === ""
                      ? []
                      : allShopsList
                },
              ]}
              keyExtractor={userShopList => userShopList.name}
              refreshing={refreshing}
              onRefresh={this.onRefresh}
              ItemSeparatorComponent={() => <Separator />}
              ListFooterComponent={<View style={{ paddingBottom: 10 }}/>}
              style={{ flex: 1 }}
            />
          </View>
        )
    );
  }
}


const styles = StyleSheet.create({
  arrowBack: {
    fontSize: 30,
    marginLeft: 25,
    color: "#fff",
    marginTop: Platform.OS === "android" ? 20 : Dimensions.get('window').height > 667 ? 0 : 15,
  }
});

ShopsScreen.navigationOptions = ({ navigation }) => ({
  headerStyle: {
    backgroundColor: colors.colorPrimary,
    height: 80,
    // marginTop: Platform.OS === "ios" ? 20 : 0,
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
    title={strings("shopsScreen.supplier")}
    color={colors.textColorPrimary}
  /> ),
  headerRight: () => ( <HeaderRightButton navigation={navigation} /> ),
  headerLeft: () => (
    <IconButton
      name={"ios-arrow-back"}
      stylesContainer={Platform.OS === "ios" ? styles.iosHeaderCenter : {}}
      stylesIcon={styles.arrowBack}
      onPress={() => navigation.goBack()}
    />
  ),
});

export default ShopsScreen;
