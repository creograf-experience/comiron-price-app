import React, { PureComponent } from "react";
import {
  FlatList,
  TouchableOpacity,
  Platform,
  View,
  Text,
} from "react-native";

import {
  BodyText,
  CoopPrice,
  Spinner,
  HeaderRightButton,
  PriceDetailHeader,
  DaysLeft,
} from "../../../components";
import { strings } from '../../../../locale/i18n';
import { ContentWrapper, Separator, NoPrice } from "../../MainScreen/components";
import { COOP_PRICE_DETAIL_SCREEN, colors } from "../../../constants";

import { getUserProfile, getViewedCoopPrices, setViewedCoopPrices } from "../../../utils";

class CooperativePurchasesScreen extends PureComponent {
  state = {
    userId: "",
    refreshing: false,
    page:1
  };

  componentDidUpdate(prevProps) {
    if(this.props.navigation.state.params){
      if(this.props.navigation.state.params.isClick){
        this.setState({showList:false});
        this.setState({isClick:true});
      }else{
        this.setState({showList:true});
        this.setState({isClick:false})
      }
    }
  }


  handleLoadMore = () => {
    this.setState({page: this.state.page + 1},this.onGetPrices);
  };

  async componentDidMount() {
    const {
      getCoopPrices,
      getUserProfileRequest,
      getUserProfileSuccess
    } = this.props;

    getUserProfileRequest();
    const user = await getUserProfile();
    const userId = user.split("~~")[0];

    getUserProfileSuccess();
    getCoopPrices(userId,this.state.page);
    this.setState({ userId });
    this.getViewedPrices();
  }

  getViewedPrices = async () => {
    const viewed = await getViewedCoopPrices();
    if (viewed) {
      const viewedPrices = viewed.split(" ");
      this.props.setViewedCoopPrices({ viewedPrices });
    }
  };

  setViewed = async price => {
    if (this.props.viewedPrices.length === 0) {
      await setViewedCoopPrices(price);
      this.props.setViewedCoopPrices({ viewedPrices: [price] });
      return;
    }
    const viewed = this.props.viewedPrices.join(" ");

    this.props.setViewedCoopPrices({
      viewedPrices: this.props.viewedPrices.concat(price)
    });

    await setViewedCoopPrices(`${viewed} ${price}`);
  };

  onGetPrices = () => {
    this.props.getCoopPrices(this.state.userId,this.state.page);
    this.setState({refreshing:false});
  };

  onRefresh = () => {
    this.setState({ refreshing: true }, this.handleLoadMore);
  };

  renderItem = ({ item }) => {
    const isViewed = this.props.viewedPrices.some(el => el === item.id);

    return (
      <TouchableOpacity
        onPress={() => {
          this.setViewed(item.id);
          this.props.navigation.navigate(COOP_PRICE_DETAIL_SCREEN, {
            personId: this.state.userId,
            priceId: item.id,
            shopId: item.id_shop,
            title: item.name,
            saved: item.saved,
            fromShop: false,
            isClick:this.props.isClick
          });
        }}
      >
        <CoopPrice
          name={item.name}
          date={item.enddate}
          shop={item.shop}
          isViewed={isViewed}
          numOrders={item.num_orders}
        />
      </TouchableOpacity>
    );
  };

  render() {
    const { coopPrices, loading } = this.props;

    if (!coopPrices.length && loading) {
      return <Spinner />;
    }

    if (!coopPrices.length && !loading) {
      return (
        <ContentWrapper>
          <NoPrice text={strings('main.noPrice')} />
          <Text style={{fontSize:14,color:colors.dataColor,marginRight:20,marginLeft:30}}>
            {strings('main.supMessage')}
          </Text>
        </ContentWrapper>
      );
    }

    return (
      <ContentWrapper>
        <FlatList
          data={coopPrices}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <Separator />}
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
          initialNumToRender={20}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={<View style={{paddingBottom:25}}/>}
        />
      </ContentWrapper>
    );
  }
}

CooperativePurchasesScreen.navigationOptions = ({ navigation }) => ({
  headerStyle: {
    backgroundColor: colors.colorPrimary,
    height: 80,
    // marginTop: Platform.OS==="ios" ? 20 : 0
  },
  headerTitle: () => <PriceDetailHeader color="white" title={strings('coopScreen.coopPur')} />,
  headerRight: () => <HeaderRightButton navigation={navigation} isBackgroundWhite={true} />
});

export default CooperativePurchasesScreen;
