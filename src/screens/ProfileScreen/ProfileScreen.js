import React, { PureComponent } from "react";
import {
  StyleSheet,
  Platform,
  Alert,
  View,
  RefreshControl,
} from "react-native";
import { fetchUserShop, fetchAllShopClients } from '../../networkers';
import {
  Spinner,
  HeaderComponent,
  VersionComponent,
} from "../../components";
import { MyClientsBtn } from "../MyShopClientsScreen/components/Buttons";
import { ContentWrapper, Avatar, InfoItem, Menu } from "./components";
import notAvailable from "../../../assets/not-available.png";
import {
  colors,
  hostImages,
  ALL_ORDER_SCREEN,
  MY_SHOP_CLIENTS_SCREEN,
  MY_PROFILE_SCREEN,
  STANDARD_COMMENT_SCREEN,
  NOTIFICATIONS_SCREEN,
  SHOPS_SCREEN
} from "../../constants";
import { getUserProfile } from "../../utils";
import { strings } from "../../../locale/i18n";

class ProfileScreen extends PureComponent {
  state = {
    user: {},
    photo: null,
    myShop: null,
    refreshing: false,
  };

  async componentDidMount() {
    const { getUserProfileRequest, getUserProfileSuccess } = this.props;
    getUserProfileRequest();

    const response = await fetchUserShop();
    if (response.shop != 0) {
      const clientsResponse = await fetchAllShopClients(response.shop.id);
      const { clients, clientsRequests } = clientsResponse;

      this.props.setClients(clients);
      this.props.setClientsRequests(clientsRequests);

      this.setState({ myShop: response.shop });
    }

    const userInString = await getUserProfile();
    const userInArray = userInString.split("~~"); // convert user profile from string to array
    const [id, firstName, lastName, email, image] = userInArray;
    const user = {
      id,
      firstName,
      lastName,
      email,
      image,
    };

    this.setState({
      user,
      photo: user.image,
    });
    
    getUserProfileSuccess();
  }

  renderModalConfirm = () => {
    Alert.alert(strings("profile.askExit"), "", [
      { text: strings("profile.no"), onPress: () => {}, style: "cancel" },
      { text: strings("profile.yes"), onPress: () => {this.props.disconnectSocket(); this.props.logOut()} }
    ]);
  };

  onPullToRefresh = async () => {
    try {
      this.setState({ refreshing: true });

      if (this.state.myShop) {
        const clientsResponse = await fetchAllShopClients(this.state.myShop.id);
        const { clients, clientsRequests } = clientsResponse;
  
        this.props.setClients(clients);
        this.props.setClientsRequests(clientsRequests);
  
        this.setState({ refreshing: false });
      }
      const userInString = await getUserProfile();
      const userInArray = userInString.split("~~"); // convert user profile from string to array
      const [id, firstName, lastName, email, image] = userInArray;
      const user = {
        id,
        firstName,
        lastName,
        email,
        image,
      };

      this.setState({
        user,
        photo: user.image,
      });


    } catch (err) {
      console.warn(err);
      this.setState({ refreshing: false });
    }
  };

  render() {
    const {
      user,
      refreshing,
      photo,
      myShop,
    } = this.state;
    const {
      loading,
      phonePhoto,
      clientsRequests,
    } = this.props;

    if (loading) {
      return <Spinner />;
    }

    return (
      <>
        <ContentWrapper
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onPullToRefresh}
            />
          }
        >
          <View
            style={{
              backgroundColor: colors.textColorPrimary,
            }}
          >
            <View
              style={{
                shadowColor: "#000",
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.3,
                shadowRadius: 3,
                elevation: 10,
                flexDirection: "row",
                justifyContent: "flex-start",
                paddingTop: 10,
                paddingBottom: 10,
              }}
            >
              {
                phonePhoto
                  ? <Avatar source={{ uri: `${phonePhoto}` }} />
                  : photo
                    ? <Avatar source={{ uri: `${hostImages}${photo + '?' + new Date()}` }} /> 
                    : <Avatar source={ notAvailable } />
              }
              <InfoItem value={user.firstName + " " + user.lastName} />
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <Menu 
              value={strings("profile.myProfile")}
              onPress={() => this.props.navigation.navigate(MY_PROFILE_SCREEN)}
            />
            <Menu 
              value={strings("allOrderScreen.showAll")}
              onPress={() => this.props.navigation.navigate(ALL_ORDER_SCREEN)}
            />
            <Menu 
              value={strings("profile.standartComment")}
              onPress={()=> this.props.navigation.navigate(STANDARD_COMMENT_SCREEN)}
            />
            <Menu
              value={strings('notificationScreen.title')}
              onPress={()=> this.props.navigation.navigate(NOTIFICATIONS_SCREEN)}
            />
            {
              myShop &&
              <View style={{ marginBottom: 5 }}>
                <MyClientsBtn
                  count={clientsRequests.length}
                  onPress={() =>
                    this.props.navigation.navigate(
                      MY_SHOP_CLIENTS_SCREEN,
                      {shop: myShop}
                    )
                  }
                />
              </View>
            }
            <Menu 
              value={strings("profile.myShops")}
              onPress={()=> this.props.navigation.navigate(SHOPS_SCREEN)}
            />
          </View>
        </ContentWrapper>
        <View style={{ backgroundColor: colors.background }}>
          <VersionComponent />
        </View>
      </>
    );
  }
}

ProfileScreen.navigationOptions = () => ({
  headerTitle: () => (
    <HeaderComponent
      title={strings("profile.profile")}
      color={colors.textColorPrimary}
    />
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

export default ProfileScreen;
