import React, { PureComponent } from "react";
import {
  StyleSheet,
  Alert,
  Animated,
  Platform,
  Dimensions,
  Keyboard,
  TextInput,
  UIManager,
  View,
} from "react-native";

const { State: TextInputState } = TextInput;

const windowHeight = Dimensions.get('window').height;

import { TextInput as CustomTextInput, Button } from "../../containers";
import { Spinner, IconButton, PriceDetailHeader,ArrowButton } from "../../components";
import { colors, AUTHENTICATION_SCREEN } from "../../constants";
import { ContainerWrapper, ButtonWrapper, Error } from "./components";
import { strings } from "../../../locale/i18n";

export default class RegisterScreen extends PureComponent {
  state = {
    email: "",
    password: "",
    repeatPassword: "",
    firstName: "",
    lastName: "",
    error: "",
    shift: new Animated.Value(0),
  };

  componentWillMount() {
    this.keyboardDidShowSub = Keyboard.addListener(
      "keyboardDidShow",
      this.handleKeyboardDidShow
    );
    this.keyboardDidHideSub = Keyboard.addListener(
      "keyboardDidHide",
      this.handleKeyboardDidHide
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
  }

  handleKeyboardDidShow = event => {
    const { height: windowHeight } = Dimensions.get("window");
    const keyboardHeight = event.endCoordinates.height;
    const currentlyFocusedField = TextInputState.currentlyFocusedField();
    UIManager.measure(
      currentlyFocusedField,
      (originX, originY, width, height, pageX, pageY) => {
        const fieldHeight = height;
        const fieldTop = pageY;
        const gap = windowHeight - keyboardHeight - (fieldTop + fieldHeight);
        if (!gap || gap >= 0) {
          return;
        }
        Animated.timing(this.state.shift, {
          toValue: gap,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    );
  };

  handleKeyboardDidHide = () => {
    Animated.timing(this.state.shift, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  onRegister = async () => {
    const { email, password, repeatPassword, firstName, lastName } = this.state;

    if (!email || !password || !repeatPassword || !firstName || !lastName) {
      this.setState({ error: strings("register.errField") });
      return;
    }

    if (password !== repeatPassword) {
      this.setState({ error: strings("register.errPass") });
      return;
    }

    const response = await this.props.register(
      email,
      password,
      repeatPassword,
      firstName,
      lastName,
    );

    if (response && response.error === "OK") {
      Alert.alert(strings("register.completeReg"), "", [
        {
          text: strings("register.ok"),
          onPress: () =>
            this.props.navigation.navigate(AUTHENTICATION_SCREEN, {
              email,
              password,
            })
        }
      ]);
      return;
    }
    this.getRegisterError(response.error);
  };

  getRegisterError = error => {
    const regex = /(<([^>]+)>)/gi;

    const err = error.replace(regex, "");

    switch (err) {
      case "!!!NO TRANSLATION for email address is already in use in common!!!":
      case "Пользователь с таким email уже существует":
        this.setState({ error: strings("register.errAlreadyUserEmail'") });
        break;
      case "Email is not valid":
      case "Неправильно набран email":
        this.setState({ error: strings("register.errEmail") });
        break;
      default:
        this.setState({ error: strings("register.errReg") });
    }
  };

  renderError = () => {
    const { error } = this.state;

    if (error) {
      return <Error>{error}</Error>;
    }
    return null;
  };

  render() {
    const {
      email,
      password,
      repeatPassword,
      firstName,
      lastName,
      shift,
    } = this.state;

    const { loading } = this.props;

    if (loading) {
      return <Spinner backgroundColor={colors.backgroundColorSecondary} color="white" />;
    }

    return (
      <ContainerWrapper>
        <Animated.View
         style={[
          { flex: 2, height: "100%" },
          { transform: [{ translateY: shift }] }
        ]}>
          <CustomTextInput
            placeholder={strings("register.entryEmail")}
            keyboardType="email-address"
            onChangeText={email => this.setState({ email })}
            onFocus={() => this.setState({ error: "" })}
            returnKeyType="done"
            value={email}
          />

          <CustomTextInput
            placeholder={strings("register.entryPass")}
            keyboardType="default"
            secureTextEntry={true}
            onChangeText={password => this.setState({ password })}
            onFocus={() => this.setState({ error: "" })}
            returnKeyType="done"
            value={password}
          />

          <CustomTextInput
            placeholder={strings("register.repeatPass")}
            keyboardType="default"
            secureTextEntry={true}
            onChangeText={repeatPassword => this.setState({ repeatPassword })}
            onFocus={() => this.setState({ error: "" })}
            returnKeyType="done"
            value={repeatPassword}
          />

          <CustomTextInput
            placeholder={strings("register.entryName")}
            keyboardType="default"
            onChangeText={firstName => this.setState({ firstName })}
            onFocus={() => this.setState({ error: "" })}
            returnKeyType="done"
            value={firstName}
          />
        
          <CustomTextInput
            placeholder={strings("register.entrySurname")}
            keyboardType="default"
            onChangeText={lastName => this.setState({ lastName })}
            onFocus={() => this.setState({ error: "" })}
            returnKeyType="done"
            value={lastName}
          />
           {this.renderError()}

        </Animated.View>
         

        <ButtonWrapper>
          <View style={{ marginBottom:Platform.OS === "ios" ? 70 : 40 }}>
            <ArrowButton onPress={this.onRegister} />
          </View>
          <Button
            fontWeight="400"
            text={strings("register.buttonLogin")}
            type="custom"
            texted
            color={colors.textColorPrimary}
            onPress={() => {
              this.props.navigation.navigate(AUTHENTICATION_SCREEN);
            }}
          />
        </ButtonWrapper>
      </ContainerWrapper>
    );
  }
}

RegisterScreen.navigationOptions = ({ navigation }) => ({
  headerStyle: {
    backgroundColor: colors.colorPrimary,
    height: 80,
    // color: "white",
    // marginTop: Platform.OS==="ios" ? 20 : 0, 
  },
  headerTitle: () => <PriceDetailHeader color="white" title={strings("register.reg")} />,
  headerLeft: () => (
    <IconButton
      name={"ios-arrow-back"}
      stylesContainer={Platform.OS === "ios" ? styles.iosHeaderCenter : {}}
      stylesIcon={styles.arrowBack}
      onPress={() => navigation.navigate(AUTHENTICATION_SCREEN)}
    />
  )
});

const styles = StyleSheet.create({
  arrowBack: {
    fontSize: 30,
    marginLeft: 25,
    color: "white",
    marginTop: Platform.OS === "android" ? 20 : windowHeight > 667 ? 0 : 15,
  },
  iosHeaderCenter: {
    height: "100%",
    alignItems: "center",
    marginBottom: 5,
  },
});
