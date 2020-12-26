import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image
} from "react-native";
import { colors } from "../../../constants";
import { strings } from "../../../../locale/i18n";
import {Ionicons} from "@expo/vector-icons";

export const Button = ({
  text,
  containerStyle,
  textStyle,
  onPress,
}) => {
  return(
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: colors.inStockColor,
          paddingHorizontal: 15,
          paddingVertical: 5,
        },
        containerStyle,
      ]}
    >
      <Text style={[
        { fontSize: 14, color: colors.colorPrimary },
        textStyle
      ]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export const ProfileButton = ({
  text,
  count,
  containerStyle,
  textStyle,
  iconStyle,
  onPress,
}) => {
  return(
    <TouchableOpacity
      onPress={ onPress }
      style={[
        {
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 7,
          paddingTop: 10,
          paddingBottom: 5,
          backgroundColor: colors.textColorPrimary,
          shadowColor: "#000",
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.3,
          shadowRadius: 3,
          elevation: 10,
        },
        containerStyle,
      ]}
    >
      <Text style={[
        { fontSize: 18, marginLeft: 20, marginTop: 3 },
        textStyle
      ]}>
        {text}
      </Text>
      <Counter count={count} />
      <Ionicons 
        name={"ios-arrow-forward"} 
        style={[
          { marginRight: 30, marginBottom: 3, fontSize: 18 },
          iconStyle
        ]}
      />
    </TouchableOpacity>
  );
};

export const AcceptRequestBtn = props => {
  return(
    <Button
      text={strings("profile.acceptBtn")}
      { ...props }
    />
  );
};

export const DeclineRequestBtn = props => {
  return(
    <Button
      text={strings("profile.declineBtn")}
      { ...props }
    />
  );
};

export const DeleteClientBtn = props => {
  return(
    <TouchableOpacity
      { ...props }
    >
      <Image
        source={require("../../../../assets/cancel.png")}
        style={{ width: 25, height: 25 }}
      />
    </TouchableOpacity>
  );
};

export const MyClientsBtn = ({ count, ...rest}) => {
  return(
    <View>
      <ProfileButton
        { ...rest }
        text={strings("profile.myClients")}
        count={count}
      />
    </View>
  );
};

const Counter = ({ count }) => {
  if (count === 0) return null;

  return(
    <View style={{
      alignSelf: "center",
      backgroundColor: colors.colorPrimary,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      height: 20,
      width: 20,
      marginRight: 150,
      marginBottom: 5,
    }}>
      <Text style={{ color: "white", fontSize: 10 }}>
        {count}
      </Text>
    </View>
  );
};
