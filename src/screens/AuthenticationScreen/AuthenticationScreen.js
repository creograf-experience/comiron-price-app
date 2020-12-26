import React, { PureComponent } from "react";
import {
  Keyboard,
  TouchableWithoutFeedback,
  LayoutAnimation,
  KeyboardAvoidingView,
  AsyncStorage
} from "react-native";

import { HeaderText, Spinner, ArrowButton } from "../../components";
import { TextInput, Button } from "../../containers";
import { colors } from "../../constants";

import {
  ContainerWrapper,
  ContentWrapper,
  AuthError,
  TitleWrapper,
} from "./components";

import { getUserToken, getUserRefreshToken, getUserProfile, getUserAgree } from "../../utils";
import { MAIN_SCREEN, REGISTER_SCREEN, USER_AGREEMENT_SCREEN, PASSWORD_RESET_SCREEN } from "../../constants";
import { strings } from "../../../locale/i18n";
import { savePhone,verifyPhone } from "../../networkers";

export default class AuthenticationScreen extends PureComponent {
  state = {
    email: "",
    emailError: false,
    password: "",
    passwordError: false,
    userAgree: "",
    loading1: false,
  };

  async componentDidMount() {
    const params = this.props.navigation.state.params;
    const { getUserTokenRequest, getUserTokenSuccess, navigation, checkProfile, connectSocket } = this.props;

    if (params && params.email) {
      this.setState({ email: params.email });
      this.setState({ password: params.password });
      return;
    }
    this.setState({ loading1: true });
    getUserTokenRequest();
    const userAgree = await getUserAgree();
    this.setState({ userAgree });
    const token = await getUserToken();
    const refreshToken=await getUserRefreshToken();
    const user = await getUserProfile();
    getUserTokenSuccess();
    if (token) {
      const timer = setTimeout(() => this.setState({ loading1: false }), 10000);
      await checkProfile(token, refreshToken);
      const userId = user.split("~~")[0];

      //Запросы к чат серверу до подключения сокета
      const chat=await AsyncStorage.getItem('chat-token')
      if(!chat && this.props.phone){
        await savePhone(this.props.phone);
        const tokenChat= await verifyPhone(this.props.phone);
        await AsyncStorage.setItem('chat-token',tokenChat.jwtToken)
      }
      await connectSocket();


      if (this.props.checkId === userId) {
        clearTimeout(timer);
        navigation.navigate(MAIN_SCREEN);
      }
    } else {
      this.setState({ loading1: false })
    }
  }

  logIn = async () => {
    const { email, password } = this.state;
    const { logIn,connectSocket,checkProfile } = this.props;

    if (!email) {
      this.setState({ emailError: true });
      return;
    }

    if (!password) {
      this.setState({ passwordError: true });
      return;
    }
    await logIn(email, password);

    const token = await getUserToken();
    const refreshToken=await getUserRefreshToken();
    if(token){
      await checkProfile(token, refreshToken);
      if(this.props.phone){
        await savePhone(this.props.phone);
        const tokenChat= await verifyPhone(this.props.phone);
        await AsyncStorage.setItem('chat-token',tokenChat.jwtToken)
      }
      await connectSocket();
      this.props.navigation.navigate(MAIN_SCREEN);
    }

  };

  onFocus = () => {
    this.clearErrors();
  };

  onChangeEmail = email => {
    const { emailError, passwordError } = this.state;
    if (emailError || passwordError) {
      this.clearErrors();
    }

    this.setState({ email });
  };

  onChangePassword = password => {
    const { emailError, passwordError } = this.state;

    if (emailError || passwordError) {
      this.clearErrors();
    }
    this.setState({ password });
  };

  clearErrors = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ emailError: false, passwordError: false });
  };

  checkUserAgree = () => {
    if (this.state.userAgree) {
      this.props.navigation.navigate(REGISTER_SCREEN);
    } else {
      this.props.navigation.navigate(USER_AGREEMENT_SCREEN);
    }
  };

  passwordReset = () => {
    this.props.navigation.navigate(PASSWORD_RESET_SCREEN);
  };

  renderAuthError = () => {
    const { authError } = this.props;

    if (authError) {
      if (authError === "Wrong login or password") {
        return <AuthError>{strings('auth.loginErr')}</AuthError>;
      }

      if (authError === "Server error") {
        return <AuthError>{strings('auth.serverErr')}</AuthError>;
      }
    }
    return null;
  };

  render() {
    const { email, emailError, password, passwordError } = this.state;

    if (this.props.loading || this.state.loading1) {
      return <Spinner backgroundColor={colors.backgroundColorSecondary} color="white"/>;
    }

    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ContainerWrapper>
          {this.renderAuthError()}

          <TitleWrapper>
            <HeaderText size="h2">Price</HeaderText>
          </TitleWrapper>

          <KeyboardAvoidingView style={{ alignItems: "center" }} behavior="height" keyboardVerticalOffset={40}>
            <TextInput
              placeholder={strings("auth.emailPlaceholderInput")}
              showError={emailError}
              errorText={strings("auth.errEmail")}
              keyboardType="email-address"
              onChangeText={this.onChangeEmail}
              onFocus={this.onFocus}
              returnKeyType="done"
              value={email}
            />

            <TextInput
              placeholder={strings("auth.passwordPlaceholderInput")}
              showError={passwordError}
              errorText={strings("auth.errPassword")}
              keyboardType="default"
              autoComplete="password"
              onChangeText={this.onChangePassword}
              onFocus={this.onFocus}
              returnKeyType="done"
              value={password}
              secureTextEntry={true}
            />
          </KeyboardAvoidingView>

          <Button
            fontWeight="400"
            text={strings("auth.passRes")}
            type="custom"
            texted
            color={colors.textColorPrimary}
            onPress={() => {this.passwordReset()}}
          />

          <ContentWrapper>
            <ArrowButton onPress={this.logIn} />
          </ContentWrapper>

          <ContentWrapper>
            <Button
              fontWeight="400"
              text={strings("auth.buttonReg")}
              type="custom"
              texted
              color={colors.textColorPrimary}
              onPress={() => {this.checkUserAgree()}}
            />
          </ContentWrapper>
        </ContainerWrapper>
      </TouchableWithoutFeedback>
    );
  }
}

AuthenticationScreen.navigationOptions = {
  title: "COMIRON",
  headerStyle: {
    backgroundColor: colors.colorPrimary,
    height: 80,
  },
  headerTitleStyle: {
    fontSize: 30,
    fontFamily: "shirota",
    color: colors.textColorPrimary,
    marginLeft: 4,
  },
  headerTitleAlign: "left",
};
