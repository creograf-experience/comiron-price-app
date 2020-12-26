import React, { Component } from "react";
import {
  StyleSheet,
  Platform,
  Dimensions,
  Animated,
  Keyboard,
  findNodeHandle,
  UIManager
} from "react-native";
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { colors } from "../../constants";
import { PriceDetailHeader, IconButton, ContainerWrapper, Spinner } from "../../components";
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';

const windowHeight = Dimensions.get('window').height;

export default class ActiveChatScreen extends Component {
  state = {
    scrollViewRef: null,
    textInputRef: null,
    shouldScroll: true
  };

  padding = new Animated.Value(0);
  platform = { ios: 'Will', android: 'Did' }

  componentDidMount(){
    this.keyboardShow = Keyboard.addListener(
      `keyboard${this.platform[Platform.OS]}Show`,
      this.handleKeyboardShow
    );
    this.keyboardHide = Keyboard.addListener(
      `keyboard${this.platform[Platform.OS]}Hide`,
      this.handleKeyboardHide
    );

    const { activeChat, clearNotification } = this.props;
    if (activeChat._id) clearNotification(activeChat._id);
  }

  async componentWillUnmount(){
    this.keyboardShow.remove();
    this.keyboardHide.remove();

    const {
      activeChat,
      clearMessages,
      clearActiveChat,
      clearSkip,
      clearNotification,
    } = this.props;

    if (!activeChat._id) return;

    clearSkip();
    clearMessages();
    //clearActiveChat();
    clearNotification(activeChat._id);
  }

  render() {
    const { navigation, activeChat } = this.props;
    const { loading, shouldScroll } = this.state;

    if (loading) {
      return <Spinner backgroundColor={colors.background}/>;
    }
    const contactPhone = navigation.getParam('contactPhone');
    const contactName = navigation.getParam('contactName');
    const imageReceiver = navigation.getParam('imageReceiver');
    const shop = navigation.getParam('shop');
    const position = navigation.getParam('position');
    return (
      <ActionSheetProvider>
        <Animated.View style={styles.container(this.padding)}>
          <MessageList
            chat={activeChat}
            setScrollViewRef={this.setScrollViewRef}
            shouldScroll={shouldScroll}
            setShouldScroll={this.setShouldScroll}
          />
          <MessageInput
            chat={activeChat}
            contactPhone={contactPhone}
            contactName={contactName}
            imageReceiver={imageReceiver}
            shop={shop}
            position={position}
            setShouldScroll={this.setShouldScroll}
            setTextInputRef={this.setTextInputRef}
          />
        </Animated.View>
      </ActionSheetProvider>
    );
  }

  handleKeyboardShow = event => {
    const { scrollViewRef, textInputRef } = this.state;
    const keyboardHeight = event.endCoordinates.height;
    const windowHeight = Dimensions.get('window').height;
    const currentlyFocusedField = findNodeHandle(textInputRef);

    UIManager.measure(currentlyFocusedField, (x, y, width, height, pageX, pageY) => {
      const fieldHeight = height;
      const fieldTop = pageY;
      const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight);

      if (!gap || gap >= 0) return;

      Animated.timing(
        this.padding,
        {
          toValue:Platform.OS==='ios' ? gap * -1 : -1,
          duration: event.duration,
        }
      ).start(() => scrollViewRef.scrollToEnd({ animated: true }));
    });
  }

  handleKeyboardHide = event => {
    Animated.timing(
      this.padding,
      {
        toValue: 0,
        duration: event ? event.duration : 100,
      }
    ).start();
  }

  setScrollViewRef = ref => this.setState({ scrollViewRef: ref });
  setTextInputRef = ref => this.setState({ textInputRef: ref });
  setShouldScroll = bool => this.setState({ shouldScroll: bool });

}

ActiveChatScreen.navigationOptions = ({ navigation }) => ({
  headerStyle: {
    backgroundColor: colors.colorPrimary,
    height: 80,
  },
  headerTitle: () => (
    <PriceDetailHeader
      color="white"
      title={navigation.state.params.header}
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
  container: padding => ({
    flex:1,
    backgroundColor: '#f5f5f5',
    paddingBottom: padding,
  }),
  arrowBack: {
    fontSize: 30,
    marginLeft: 25,
    color: "#fff",
    marginTop: Platform.OS === "android" ? 20 : windowHeight > 667 ? 0 : 15,
  },
  iosHeaderCenter: {
    height: "100%",
    alignItems: "center",
    marginBottom: 5,
    marginRight: 15,
  }
});
