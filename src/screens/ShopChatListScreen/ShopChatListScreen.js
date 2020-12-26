import React, { Component } from "react";
import {
  StyleSheet,
  Platform,
  Dimensions,
  FlatList,
  TouchableOpacity,
  View,
  Image,
  AsyncStorage
} from "react-native";
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

import { colors, ACTIVE_CHAT_SCREEN } from "../../constants";
import { PriceDetailHeader, IconButton, Spinner } from "../../components";
import { Separator } from "../AllOrderScreen/components";
import notAvailable from "../../../assets/not-available.png";
import ChatInfo from "../MainChatListScreen/components/ChatInfo";
import { addToken } from '../../networkers'
import ImageEmployer from "../ChooseStaffShopsChatScreen/components/ImageEmployer";

const windowHeight = Dimensions.get('window').height;

export default class ShopChatListScreen extends Component {
  state = {
    chats:this.props.navigation.state.params.chat,
    shop:this.props.navigation.state.params.shop,
    isLoading:false,
  };

  async componentDidMount() {
    if(await AsyncStorage.getItem('chat-token')){
      this.setState({ isLoading: true });
      await this.props.fetchChats();
      this.setState({ isLoading: false });
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



  renderItem = ({item}) => {
    const { navigation, setActiveChat, user, flagRerender, clearActiveChat } = this.props;
    const {shop} = this.state;
    const fioInLabel = item.users.find(item =>
      item.phone!==user
    );
    if(!item.shop && !shop){
      return(
        <TouchableOpacity
          style={[ styles.itemContainer, { shadowOffset: {width: 5, height: 0} } ]}
          onPress={() => {
            clearActiveChat();
            setActiveChat(item);
            navigation.navigate(ACTIVE_CHAT_SCREEN,{
              header:fioInLabel
                ? fioInLabel.contactName
                : null
            })
          }}
        >
          <View style={{justifyContent:'center', marginRight:10}}>
            <ImageEmployer image={fioInLabel ? fioInLabel.avatar : null}/>
          </View>
          <ChatInfo userPhone={this.props.user} chat={item} shopFlag={false}/>
        </TouchableOpacity>
      )
    } else if(shop && item.shop && shop.id===item.shop.id){
      return(
        <TouchableOpacity
          style={[ styles.itemContainer, { shadowOffset: {width: 5, height: 0} } ]}
          onPress={() => {
            clearActiveChat();
            setActiveChat(item);
            navigation.navigate(ACTIVE_CHAT_SCREEN,{
              header:fioInLabel
                ? fioInLabel.contactName
                : null
            })
          }}
        >
          <View style={{justifyContent:'center', marginRight:10}}>
            <ImageEmployer image={fioInLabel ? fioInLabel.avatar : null}/>
          </View>
          <ChatInfo userPhone={this.props.user} chat={item} shopFlag={false}/>
        </TouchableOpacity>
      )
    }
  }

  render() {
    const { isLoading, chats } = this.state;

    if (isLoading) {
      return <Spinner backgroundColor={colors.background}/>;
    }

    return (
      <FlatList
        data={this.props.chats}
        extraData={chats}
        renderItem={this.renderItem}
        keyExtractor={item => String(item._id)}
        ItemSeparatorComponent={()=><Separator/>}
      />
    );
  }
}

ShopChatListScreen.navigationOptions = ({ navigation }) => ({
  headerStyle: {
    backgroundColor: colors.colorPrimary,
    height: 80,
  },
  headerTitle: () => (
    <PriceDetailHeader
      color="white"
      title= {navigation.state.params.shop ? navigation.state.params.shop.name : "Чаты с контактами"}
      flag={"long"}
    />
  ),
  headerLeft: () => (
    <IconButton
      name={"ios-arrow-back"}
      stylesContainer={Platform.OS === "ios" ? styles.iosHeaderCenter : {}}
      stylesIcon={styles.arrowBack}
      onPress={() => navigation.goBack()}
    />
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
  itemContainer: {
    paddingLeft: 15,
    paddingRight: 15,
    shadowColor: "rgba(0, 0, 0, 0.05)",
    shadowRadius: 5,
    shadowOpacity: 1,
    backgroundColor: colors.textColorPrimary,
    paddingTop: 15,
    paddingBottom: 15,
    flexDirection:'row'
  }
});
