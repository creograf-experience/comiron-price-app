import React, { Component } from "react";
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import * as Contacts from 'expo-contacts';
import {
  StyleSheet,
  Platform,
  Dimensions,
  FlatList,
  View,
  TouchableOpacity,
  Image,
  AsyncStorage,
  Text
} from "react-native";

import { colors, SHOP_CHAT_LIST_SCREEN, hostImages, ACTIVE_CHAT_SCREEN } from "../../constants";
import { PriceDetailHeader, IconButton, ContainerWrapper, Spinner, HeaderComponent } from "../../components";
import { Separator } from "../AllOrderScreen/components";
import ChatInfo from "./components/ChatInfo";
import notAvailable from "../../../assets/not-available.png";
import { addToken } from '../../networkers'
import { getExpoPushtoken } from "../../utils";
import { NoPrice } from "../MainScreen/components";
import { HeaderRightContacts } from "../ContactsScreen/components/HeaderRightContacts";
import ImageEmployer from "../ChooseStaffShopsChatScreen/components/ImageEmployer";

const windowHeight = Dimensions.get('window').height;

export default class MainChatListScreen extends Component {
  state = {
    isLoading:false,
  };

  async componentDidMount() {
    if(await AsyncStorage.getItem('chat-token')){
      this.setState({ isLoading: true });

      await this.registerForPushNotificationsAsync();

      await this.props.fetchChats();

      this.setState({ isLoading: false });

      this.notificationSubscription = Notifications.addListener(this.handleNotification);
    }
  }

  async componentDidUpdate(prevProps) {
    const { isSocketConnected, fetchChats } = this.props;

    if (prevProps.isSocketConnected && !isSocketConnected) {
      if (!await AsyncStorage.getItem('chat-token')) return;

      console.log('SCOKET IS GONE');
      this.setState({ isLoading: true });
      await fetchChats();
      this.setState({ isLoading: false });
    };
  }

  handleNotification = notification => {
    const { chat } = notification.data;
    const { navigation, setActiveChat, activeChat, user, flagRerender } = this.props;
    /*if (!chat) {
      navigation.navigate(CONTACTS_SCREEN);
      return;
    }*/

    if (!activeChat || activeChat._id !== chat._id) {
      setActiveChat(chat.chat)

      const fioInLabel = chat.chat.users.find(item =>
        item.phone!==user
      );
      navigation.navigate(ACTIVE_CHAT_SCREEN, {
        header: fioInLabel ? fioInLabel.contactName : null
      });
    }
  };

  registerForPushNotificationsAsync = async () => {
    try {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        return;
      }
      const pushToken = await getExpoPushtoken();
      if(pushToken){
        await addToken(pushToken)
      }else {
        const ExpoPushToken = await Notifications.getExpoPushTokenAsync();
        await AsyncStorage.setItem('ExpoPushToken', ExpoPushToken);
        await addToken(ExpoPushToken)
      }

    } catch (err) {
      return console.warn(err);
    }
  };


  renderItem = ({item}) => {
    if(item.shop){
      return (
        <TouchableOpacity
          style={[ styles.itemContainer, { shadowOffset: {width: 5, height: 0} } ]}
          onPress={() => {
            this.props.navigation.navigate(SHOP_CHAT_LIST_SCREEN, {
              shop:item.shop,
              chat:[item]
            })
          }}
        >
          <View style={{justifyContent:'center', marginRight:10}}>
            <Image
              style={{
                height:60,
                width:60,
                borderRadius:30,
                marginRight:10
              }}
              source={item.shop
                ? item.shop.thumbnail_url
                  ? {uri: `${hostImages}${item.shop.thumbnail_url}`}
                  : notAvailable
                : notAvailable}
            />
          </View>
          <ChatInfo userPhone={this.props.user} chat={item} shopFlag={true}/>
        </TouchableOpacity>
      );
    } else {
      let exetUse = null;
      const fioInLabel = item.users.find(item =>
        item.phone!==this.props.user
      );
      if(!fioInLabel) {
        exetUse = item.users.find(item =>
          item.phone==this.props.user
        );
      }
      return(
        <TouchableOpacity
          style={[ styles.itemContainer, { shadowOffset: {width: 5, height: 0} } ]}
          onPress={() => {
            this.props.clearActiveChat();
            this.props.setActiveChat(item);
            this.props.navigation.navigate(ACTIVE_CHAT_SCREEN,{
              header:fioInLabel
                ? fioInLabel.contactName
                : exetUse.contactName
            })
          }}
        >
          <View style={{justifyContent:'center', marginRight:10}}>
            <ImageEmployer image={fioInLabel
              ? fioInLabel.avatar
              : exetUse
                ? exetUse.avatar
                : null
            }/>
          </View>
          <ChatInfo userPhone={this.props.user} chat={item} shopFlag={false}/>
        </TouchableOpacity>
      )
    }
  }

  render() {
    const { isLoading } = this.state;
    if (isLoading) {
      return <Spinner backgroundColor={colors.background}/>;
    }
    if (!this.props.shopChats.length && !isLoading) {
        return(
          <View>
            <NoPrice text="Здесь будут чаты с сотрудниками магазинов."/>
            <Text style={{ fontSize: 14, color: colors.dataColor, marginRight: 20, marginLeft: 30 }}>
              Напиши им через страницу магазина
            </Text>
          </View>
        )
    }

    return (
      <FlatList
        data={this.props.shopChats}
        extraData={this.props.shopChats}
        renderItem={this.renderItem}
        keyExtractor={item => String(item._id)}
        ItemSeparatorComponent={()=><Separator/>}
      />
    );
  }
}

MainChatListScreen.navigationOptions = ({ navigation }) => ({
  headerStyle: {
    backgroundColor: colors.colorPrimary,
    height: 80,
  },
  headerTitle: () => (
    <HeaderComponent color={'white'} title="Чаты"/>
  ),
  headerRight: () => (
    <HeaderRightContacts navigation={navigation} />
  )
  });

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  deleteBtnStyle: {
    fontSize: 24,
    color: colors.colorPrimary,
  },
  arrowBack: {
    fontSize: 30,
    marginLeft: 25,
    color: "#fff",
    marginTop: Platform.OS === "android" ? 20 : windowHeight > 667 ? 0 : 15,
  },
  iconList : {
    fontSize: 30,
    marginRight: 10,
    color: "#fff",
    marginTop: Platform.OS === "android" ? 18 : windowHeight > 667 ? 0 : 15,
  },
  iosHeaderCenter: {
    height: "100%",
    alignItems: "center",
    marginBottom: 5,
    marginRight: 15,
  },
  itemContainer:{
    paddingLeft: 15,
    paddingRight: 15,
    shadowColor: "rgba(0, 0, 0, 0.05)",
    shadowRadius: 5,
    shadowOpacity: 1,
    backgroundColor:colors.textColorPrimary,
    paddingTop: 15,
    paddingBottom: 15,
    flexDirection:'row'
  }
});
