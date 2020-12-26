import React, { PureComponent } from "react";
import { Platform, StyleSheet, ScrollView, Text, Dimensions } from "react-native";

import { CheckBox } from "react-native-elements";

import * as WebBrowser from "expo-web-browser";

import { strings, currentLocale } from "../../../locale/i18n";
import { Button } from "../../containers";
import { AUTHENTICATION_SCREEN, REGISTER_SCREEN, colors } from "../../constants";
import { setAddUserAgree } from "../../utils";
import { IconButton, PriceDetailHeader } from "../../components";
import { ContainerWrapper } from "./components";
import { View } from "native-base";

const windowHeight = Dimensions.get('window').height;

export default class UserAgreementScreen extends PureComponent {
  state = {
    firstChosen: false,
    secondChosen: false,
    thirdChosen: false,
  };
 
  onComplete = async () => {
    await setAddUserAgree();
    this.props.navigation.navigate(REGISTER_SCREEN);
  };

  handleLink = async (url) => {
    await WebBrowser.openBrowserAsync(url);
  };
  
  render() {
    const { firstChosen, secondChosen, thirdChosen } = this.state;

    return (
      <ScrollView style={{ backgroundColor: colors.backgroundColorSecondary }}>
        {
          currentLocale === "ru-RU" ? (
            <ContainerWrapper>
              <View style={styles.container}>
                <Text
                  style={styles.rulesTitleStyle}
                  onPress={() => this.handleLink(strings("userAgreementScreen.rules"))}
                >
                  {strings("userAgreementScreen.rulesTitle")}
                </Text>
                <CheckBox
                  containerStyle={{ marginTop: 32 }}
                  size={32}
                  iconType="material"
                  checkedIcon="check-box"
                  uncheckedIcon="check-box-outline-blank"
                  checkedColor={colors.colorPrimary}
                  uncheckedColor="white"
                  checked={firstChosen}
                  onPress={() => this.setState({ firstChosen: !firstChosen })}
                />
              </View>
              <View style={styles.container}>
                <Text
                  style={styles.confTitleStyle}
                  onPress={() => this.handleLink(strings("userAgreementScreen.confidence"))}
                >
                  {strings("userAgreementScreen.confTitle")}
                </Text>
                <CheckBox
                  containerStyle={{ marginTop: 9 }}
                  size={32}
                  iconType="material"
                  checkedIcon="check-box"
                  uncheckedIcon="check-box-outline-blank"
                  checkedColor={colors.colorPrimary}
                  uncheckedColor="white"
                  checked={secondChosen}
                  onPress={() => this.setState({ secondChosen: !secondChosen })}
                />
              </View>
              <View style={styles.container}>
                <Text
                  style={styles.offerTitleStyle}
                  onPress={() => this.handleLink(strings("userAgreementScreen.offer"))}
                >
                  {strings("userAgreementScreen.offerTitle")}
                </Text>
                <CheckBox
                  containerStyle={{ marginTop: 8 }}
                  size={32}
                  iconType="material"
                  checkedIcon="check-box"
                  uncheckedIcon="check-box-outline-blank"
                  checkedColor={colors.colorPrimary}
                  uncheckedColor="white"
                  checked={thirdChosen}
                  onPress={() => this.setState({ thirdChosen: !thirdChosen })}
                />
              </View>
              <View style={{ marginTop: 150 }}>
                {
                  firstChosen && secondChosen && thirdChosen
                    ? <Button
                        fontSize="12"
                        text={strings("userAgreementScreen.acceptAgree")}
                        onPress={() => {this.onComplete()}}
                      />
                    : null
                }
              </View>
            </ContainerWrapper>
          )
          : (
            <ContainerWrapper>
              <View style={styles.container}>
                <Text
                  style={styles.confTitleStyle}
                  onPress={() => this.handleLink(strings("userAgreementScreen.confidence"))}
                >
                  {strings("userAgreementScreen.confTitle")}
                </Text>
                <CheckBox
                  containerStyle={{ marginTop: 9 }}
                  size={32}
                  iconType="material"
                  checkedIcon="check-box"
                  uncheckedIcon="check-box-outline-blank"
                  checkedColor={colors.colorPrimary}
                  uncheckedColor="white"
                  checked={secondChosen}
                  onPress={() => this.setState({ secondChosen: !secondChosen })}
                />
              </View>
              <View style={{ marginTop: 150 }}>
                {
                  secondChosen
                    ? <Button
                        fontSize="12"
                        text={strings("userAgreementScreen.acceptAgree")}
                        onPress={() => {this.onComplete()}}
                      />
                    : null
                }
              </View>
            </ContainerWrapper>
          )
        }
      </ScrollView>
    );
  }
}

UserAgreementScreen.navigationOptions = ({ navigation }) => ({
  headerStyle: {
    backgroundColor: colors.colorPrimary,
    height: 80,
    // color: "white",
    // marginTop: Platform.OS === "ios" ? 20 : 0,
  },
  headerTitle: () => <PriceDetailHeader color="white" title={strings("userAgreementScreen.termsOfUse")} />,
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
  container: {
    flex: 1,
    flexDirection: "row",
  },
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
  rulesTitleStyle: {
    flex: 4,
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    textDecorationLine: "underline",
    textDecorationColor: colors.colorPrimary,
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: 10,
  },
  confTitleStyle: {
    flex: 4,
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    textDecorationLine: "underline",
    textDecorationColor: colors.colorPrimary,
    paddingTop: 15,
    paddingBottom: 25,
    marginTop: 10,
  },
  offerTitleStyle: {
    flex: 4,
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    textDecorationLine: "underline",
    textDecorationColor: colors.colorPrimary,
    paddingTop: 15,
    marginTop: 10,
  },
});
