import React, { PureComponent } from "react";
import { View, TextInput, Image, Text, Platform } from "react-native";

import { colors } from "../../constants";
import { PhoneInputContainer } from "../../components";
import {strings} from "../../../locale/i18n";

export class PhoneInputComponent extends PureComponent {
  state = {
    text: this.props.phone,
    error: this.props.error,
  };

  handleChange = text => {
    if (text[0] === "8" || text[1] === "8") {
      text = text.replace("8", "7");
    }
    if (this.props.keyboardType === "phone-pad") {
      if (text[0] != "+") {
        text = "+" + text;
      }
      text = text[0] + text.slice(1).replace(/[^0-9]/g, "");
    }
    if (text.length == "1" && text[0] == "+") {
      text = "";
    }
    if (!text) {
      this.props.deletePhone();
    }

    this.setState({ text, error: false });
    this.props.onChange(text);
  }

  render() {
    const { text, error } = this.state;
    const { placeholder } = this.props;

    return (
      <View style={{ flexDirection: "row" }}>
        <Image
          source={require("../../../assets/phone-icon.filled.png")}
          style={{ tintColor: colors.colorPrimary, width: 30, height: 30, marginLeft: 10 }}
        />
        <PhoneInputContainer>
          <TextInput
            style={{
              fontSize: 16,
              width: "98%",
              marginLeft: 5,
              marginTop: Platform.OS === "android" ? 0 : 4,
              alignSelf: "center",
              color: colors.textColorSecondary,
            }}
            value={text}
            placeholder={placeholder}
            onChangeText={this.handleChange}
            returnKeyType="done"
            {...this.props}
          />
        </PhoneInputContainer>
        {
          error && !text
            ? <Text style={{ fontSize: 14, color: "red", marginTop: 6 }}>{strings("cartScreen.noPhone")}</Text>
            : null
        }
      </View>
    );
  }
}

PhoneInputComponent.defaultProps = {
  placeholder: "Phone",
  onChange: () => {},
};
