import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Platform,
  Dimensions,
} from "react-native";

import { colors } from "../../constants";
import { strings } from "../../../locale/i18n";

import {
  PriceDetailHeader,
  IconButton,
} from "../../components";

import { scale, verticalScale } from "react-native-size-matters";

const windowHeight = Dimensions.get('window').height;

const ContactScreen = () => {
  return (
    <View style={styles.container}>

      <View
        style={{
          width: "100%",
          height: scale(60),
          backgroundColor: colors.colorPrimary,
          alignItems: "center",
        }}
      >
        <View
          style={{
            shadowColor: "#000",
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.3,
            shadowRadius: 3,
            elevation: 10,
          }}
        >
          <Image
            style={styles.avatar}
            source={require("../../../assets/icon.png")}
          />
        </View>
      </View>

      <Text style={{
        textAlign: "center",
        fontSize: 15,
        marginTop: 80,
        marginHorizontal: scale(15),
      }}>
        {strings("contactScreen.appSupplier")}
      </Text>
      <TouchableOpacity
        onPress={() => Linking.openURL("mailto:comiron.price@gmail.com")}
      >
        <Text style={{
          textAlign: "center",
          fontSize: 17,
          color: colors.colorPrimary,
          marginTop: verticalScale(20),
          fontWeight: "bold",
        }}>
          comiron.price@gmail.com
        </Text>
      </TouchableOpacity>
    </View>
  );
};

ContactScreen.navigationOptions = ({ navigation }) => ({
  headerTitle: () => ( <PriceDetailHeader
    title={strings("contactScreen.contact")}
    color={colors.textColorPrimary}
  /> ),
  headerStyle: {
    backgroundColor: colors.colorPrimary,
    height: 80,
    // marginTop: Platform.OS === "ios" ? 20 : 0,
    shadowColor: "transparent",
    shadowRadius: 0,
    shadowOffset: {
      height: 0,
    },
    elevation: 0,
    borderBottomWidth: 0
  },
  headerTintColor: colors.textColorPrimary,
  headerLeft: () => (
    <IconButton
      name={"ios-arrow-back"}
      stylesContainer={Platform.OS === "ios" ? styles.iosHeaderCenter : {}}
      stylesIcon={styles.arrowBack}
      onPress={() => navigation.goBack()}
    />
  ),
  // невидимый элемент, чтобы выровнять
  // текст заголовка по центру
  headerRight: () => (
    <View style={{ marginRight: 15 }} />
  ),
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
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 30,
  },
  avatar: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(55),
    borderColor: colors.colorSecondary,
    borderWidth: 2,
  },
});

export default ContactScreen;
