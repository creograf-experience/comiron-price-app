import React, { Component } from "react";
import {
  StyleSheet,
  Platform,
  Dimensions,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Image,
  AsyncStorage
} from "react-native";

import { colors } from "../../constants";
import { PriceDetailHeader, IconButton, ContainerWrapper, Spinner } from "../../components";
import { Separator } from "../AllOrderScreen/components";
import notAvailable from "../../../assets/not-available.png";
import {ACTIVE_CHAT_SCREEN} from '../../constants/routes';
import ImageEmployer from "./components/ImageEmployer";

const windowHeight = Dimensions.get('window').height;

export default class ChooseStaffShopsChatScreen extends Component {
  state = {
    isLoading:false,
    shop:this.props.navigation.state.params.shop,
    shopId:this.props.navigation.state.params.shopId,
    selectedPhone: '',
    staffList : []
  };

  async componentDidMount() {
    this.setState({isLoading: true,staffList:[]})
    await this.props.fetchEmployeShops(this.state.shopId);
    const staffList = this.props.employeList.filter(item=>item.phone && item.phone.replace(/\D/g, '')!==this.props.phone)

    this.setState({staffList})
    if(await AsyncStorage.getItem('chat-token')){
      await this.props.fetchChats();
    }
    this.setState({ isLoading: false });
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

  openChat = (item) => {
    const { chats } = this.props;
    const replaceNumber=item.phone.replace(/\D/g, '');

    const existingChat = chats.find(chat =>
      chat.users.find(user=> replaceNumber === user.phone)
    );

    return existingChat
      ? this.openExistingChat(existingChat,item)
      : this.openNewChat(item);
  }

  openExistingChat = (chat,item) => {
    const { navigation, setActiveChat, clearActiveChat, flagRerender } = this.props;

    flagRerender(true);
    clearActiveChat();
    setActiveChat(chat);
    navigation.navigate(ACTIVE_CHAT_SCREEN, {
      flagRerender: true,
      header: item.fio,
    });
  }

  openNewChat = (item) => {
    const { navigation, clearActiveChat,flagRerender } = this.props;
    const replaceNumber=item.phone.replace(/\D/g, '');

    flagRerender(true);
    clearActiveChat();
    navigation.navigate(ACTIVE_CHAT_SCREEN, {
      header: item.fio,
      flagRerender: true,
      contactPhone: replaceNumber,
      contactName: item.fio,
      position:item.position,
      imageReceiver: item.thumbnail_url ? item.thumbnail_url : null,
      shop:this.state.shop
    });
  }

  renderItem = ({ item }) => {
    return (
      <View style={[ styles.layoutComment, { shadowOffset: {width: 5, height: 0} } ]}>
        <View style={{justifyContent:'center',marginRight:10}}>
          <ImageEmployer image={item.thumbnail_url ? item.thumbnail_url : null}/>
        </View>
        <View style={{flex:6, marginBottom:5}}>
          <Text style={{ fontSize: 18, marginTop: 2,marginBottom:3, fontWeight:'bold' }}>{item.position}</Text>
          <Text style={{ fontSize: 16 }}>{item.fio}</Text>
        </View>
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <TouchableOpacity onPress={()=>this.openChat(item)}>
            <Image
              style={{
                height: 25,
                width: 25,
                tintColor:colors.colorPrimary,
                resizeMode: "contain",
              }}
              source={require("../../../assets/notifications.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    const { isLoading,staffList } = this.state;
    if (isLoading) {
      return <Spinner backgroundColor={colors.background}/>;
    }
    return (
      <ContainerWrapper>
        <FlatList
          style={{ paddingTop: 5 }}
          data={staffList}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <Separator/>}
        />
      </ContainerWrapper>
    );
  }
}

ChooseStaffShopsChatScreen.navigationOptions = ({ navigation }) => ({
  headerStyle: {
    backgroundColor: colors.colorPrimary,
    height: 80,
  },
  headerTitle: () => (
    <PriceDetailHeader
      color="white"
      title={navigation.state.params.title}
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
  layoutComment: {
    paddingLeft: 10,
    shadowColor: "rgba(0, 0, 0, 0.05)",
    shadowRadius: 5,
    shadowOpacity: 1,
    backgroundColor: colors.textColorPrimary,
    paddingTop: 5,
    paddingBottom: 5,
    flexDirection:'row'
  },
});
