import React, { PureComponent } from "react";
import {
  Alert,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  LayoutAnimation,
} from "react-native";
import { Button } from "react-native-elements";

import { sendMailRequest } from './actions';
import { strings } from "../../../locale/i18n";
import { AuthHeader, HeaderText, PassResHeaderText } from "../../components";
import { AUTHENTICATION_SCREEN, colors } from "../../constants";
import { TextInput } from "../../containers";
import { ContainerWrapper } from "../AuthenticationScreen/components";
import { PassResTitleWrapper, TitleWrapper } from "./components";

export default class PasswordResetScreen extends PureComponent {
  state = {
    email: "",
    emailError: false,
  };

  componentDidMount() {
    const params = this.props.navigation.state.params;

    if (params && params.email) {
      this.setState({ email: params.email });
      return;
    }
  }

  onFocus = () => {
    this.clearErrors();
  };

  onChangeEmail = email => {
    const { emailError } = this.state;
    if (emailError) {
      this.clearErrors();
    }

    this.setState({ email });
  };

  clearErrors = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ emailError: false });
  };

  onSendMail = async () => {
    const { email } = this.state;
    const response = await sendMailRequest(email);

    if (!email) {
      this.setState({ emailError: true });
      return;
    }

    response == 1 ?
      Alert.alert(
        strings("passwordResetScreen.emailSuccess"),
        "",
        [
          {
            text: "OK",
            onPress: () => this.goToAuthScreen()
          },
        ],
      )
    : Alert.alert(strings("passwordResetScreen.emailFailure"));

    return response;
  };

  goToAuthScreen = () => {
    const { navigation } = this.props;
    navigation.navigate(AUTHENTICATION_SCREEN);
  };

  render() {
    const { email, emailError } = this.state;
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ContainerWrapper>

          <TitleWrapper>
            <HeaderText size="h2">Price</HeaderText>
          </TitleWrapper>

          <PassResTitleWrapper>
            <PassResHeaderText size="h3">{strings("passwordResetScreen.title")}</PassResHeaderText>
          </PassResTitleWrapper>

          <KeyboardAvoidingView
            style={{ alignItems: "center" }}
            behavior="position"
            keyboardVerticalOffset={80}
          >
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
          </KeyboardAvoidingView>

          <Button
            buttonStyle={styles.buttonStyle}
            title={strings("passwordResetScreen.buttonSend")}
            onPress={() => this.onSendMail()}
            />
          <Button
            type="clear"
            title={strings("passwordResetScreen.buttonCancel")}
            titleStyle={{ color: colors.textColorPrimary }}
            onPress={() => this.goToAuthScreen()}
          />

        </ContainerWrapper>
      </TouchableWithoutFeedback>
    );
  }
}

PasswordResetScreen.navigationOptions = {
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

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: colors.colorPrimary,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 100,
    marginRight: 100,
  },
});
