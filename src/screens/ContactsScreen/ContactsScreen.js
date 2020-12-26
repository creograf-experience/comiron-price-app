import React, { Component } from "react";
import {
  StyleSheet,
  Platform,
  Dimensions,
  FlatList,
  View,
  Text,
  AsyncStorage,
  TouchableOpacity,
  Image,
  Alert
} from "react-native";
import { colors, ACTIVE_CHAT_SCREEN } from "../../constants";
import * as Permissions from 'expo-permissions';
import * as Contacts from 'expo-contacts';
import { PriceDetailHeader, IconButton, ContainerWrapper, Spinner } from "../../components";
import { Separator } from "../AllOrderScreen/components";
import ImageEmployer from "../ChooseStaffShopsChatScreen/components/ImageEmployer";
import { strings } from "../../../locale/i18n";
import { NoPrice } from "../MainScreen/components";

const windowHeight = Dimensions.get('window').height;

export default class ContactsScreen extends Component {
  state = {
    isLoading:false,
    contact:[]
  };
  async componentDidMount() {
    if(await AsyncStorage.getItem('chat-token')){
      this.setState({ isLoading: true });
      await this.props.fetchChats();
      await this.sendContactsToServer();

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

  sendContactsToServer = async () => {
    try {
      const permission = await Permissions.askAsync(Permissions.CONTACTS);

      if (permission.status !== 'granted') {
        return Alert.alert(
          'Нет доступа к контактам',
          'Предоставьте доступ в настройках',
          [
            {
              text:strings('priceDetail.ok'),
              onPress: ()=>this.props.navigation.goBack()
            }
          ]
        );
      }

      let { data } = await Contacts.getContactsAsync();
      if (!data.length) { return Alert.alert('',
       'У вас нет контактов',
       [
        {
          text:strings('priceDetail.ok'),
          onPress: ()=>this.props.navigation.goBack()
        }
        ])
      };

      const numberArray = data.filter(item=>item.phoneNumbers)
        .map(item=>item.phoneNumbers).flat()
        .map(item=>item.number)
        .map(item=>'7'+item.replace(/\D/g, '').slice(1));
      await this.props.fetchContacts({"phones":numberArray})
      this.setState({contact:this.props.contactList})
    } catch (err) {
      console.warn(err);
    }
  };

  openChat = (item) => {
    const { chats } = this.props;
    const replaceNumber=item.phone.replace(/\D/g, '');

    let existingChat = null;
    if(item.phone===replaceNumber){
      existingChat = chats.find(chat=>
        chat.users[0].phone === replaceNumber &&  chat.users[1].phone === replaceNumber
      )
    } else {
      existingChat = chats.find(chat =>
        chat.users.find(user=> replaceNumber === user.phone)
      );
    }

    return existingChat
      ? this.openExistingChat(existingChat,item)
      : this.openNewChat(item);
  }

  openExistingChat = (chat,item) => {
    const { navigation, setActiveChat, clearActiveChat } = this.props;

    clearActiveChat();
    setActiveChat(chat);
    navigation.navigate(ACTIVE_CHAT_SCREEN, {
      flagRerender: true,
      header: `${item.first_name} ${item.last_name}`,
    });
  }

  openNewChat = (item) => {
    const { navigation, clearActiveChat } = this.props;
    const replaceNumber=item.phone.replace(/\D/g, '');

    clearActiveChat();
    navigation.navigate(ACTIVE_CHAT_SCREEN, {
      header: `${item.first_name} ${item.last_name}`,
      flagRerender: true,
      contactPhone: replaceNumber,
      contactName: `${item.first_name} ${item.last_name}`,
      position:null,
      imageReceiver: item.thumbnail_url ? item.thumbnail_url : null,
      shop:{}
    });
  }

  renderItem = ({item}) => {
    return (
      <View  style={[ styles.layoutComment, { shadowOffset: {width: 5, height: 0} } ]}>
        <View style={{justifyContent:'center',marginRight:10}}>
          <ImageEmployer image={item.thumbnail_url ? item.thumbnail_url : null}/>
        </View>
        <View style={{flex:6, marginBottom:5, justifyContent:'center'}}>
          <Text style={{ fontSize: 16 }}>{item.first_name} {item.last_name}</Text>
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
    )
  }

  render() {
    const { isLoading,contact } = this.state;
    if(isLoading){
      return <Spinner backgroundColor={colors.background}/>
    }
    if (!contact && !isLoading) {
      return(
        <View>
          <NoPrice text="Ваши контакты не используют приложение"/>
        </View>
      )
  }
    return(
      <ContainerWrapper>
        <FlatList
          style={{paddingTop: 5}}
          data = {contact}
          renderItem={this.renderItem}
          keyExtractor={(item,index)=> index.toString()}
          ItemSeparatorComponent={()=> <Separator/>}
        />
      </ContainerWrapper>
    )
  }
}

ContactsScreen.navigationOptions = ({ navigation }) => ({
  headerStyle: {
    backgroundColor: colors.colorPrimary,
    height: 80,
  },
  headerTitle: () => (
    <PriceDetailHeader
      color="white"
      title="Контакты"
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