import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions
} from "react-native";

import { colors } from "../../constants";
import { dadataGetAddressRequest, addUserAddressRequest, checkProfileNetworkRequest } from "../../networkers";

import { PriceDetailHeader, IconButton, Spinner } from "../../components";
import { Button } from "../../containers";

const windowHeight = Dimensions.get('window').height;

export class AddAddressScreen extends Component {
  state = {
    loading: false,
    input: "",
    address: null,
    suggestions: [],
    postalCode: "",
    region: "",
    city: "",
    street: "",
    house: "",
    showSuggestions: true,
    isRequestFinished: true
  };

  render() {
    if (this.state.loading) {
      return <Spinner />
    }

    return(
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 10,
          paddingVertical: 10
        }}
        nestedScrollEnabled
      >
        <Text style={styles.header}>
          Новый адрес
        </Text>

        <Text style={[styles.regular, styles.bold, { marginBottom: 10 }]}>
          Впишите в ПОЛЕ ВВОДА ваш полный адрес, в том числе номер дома и квартиру
          ( можно без индекса - он определится автоматически )
        </Text>

        <Text style={[styles.regular, styles.bold]}>
          В нижних полях отображается систематизированный адрес.
          Эти поля правятся только через ПОЛЕ ВВОДА.
          Если хотите в них что-то изменить, то измените это в ПОЛЕ ВВОДА.
        </Text>

        <TextInput
          style={[styles.input, { borderColor: "gray", color: "gray", height: 60 }]}
          placeholder="Поле ввода"
          placeholderTextColor="gray"
          value={this.state.input}
          multiline
          onChangeText={text => {
            this.setState({ input: text, showSuggestions: true });
            if (this.state.isRequestFinished) {
              this.setState({ isRequestFinished: false })
              setTimeout(async () => {
                const res = await dadataGetAddressRequest(this.state.input);
                this.setState({ suggestions: res.suggestions, isRequestFinished: true });
              }, 200);
            }
          }}
        />

        {
          this.state.suggestions.length > 0 && this.state.showSuggestions &&
            <View style={{
              flex: 1,
              height: 200,
              borderWidth: 1,
              borderRadius: 5,
              borderColor: "gray"
            }}>
              <ScrollView
                nestedScrollEnabled
                contentContainerStyle={{
                  paddingHorizontal: 10,
                  paddingVertical: 5
                }}
              >
                {this.state.suggestions.map(suggestion =>
                  <TouchableOpacity
                    key={suggestion.value}
                    style={{
                      marginBottom: 10,
                      padding: 10,
                      borderWidth: 1,
                      backgroundColor: "white",
                      borderRadius: 5,
                      borderColor: "gray"
                    }}
                    onPress={() => this.setState({
                      input: suggestion.value,
                      postalCode: suggestion.data.postal_code,
                      region: suggestion.data.region_with_type || suggestion.data.area_with_type,
                      city: suggestion.data.city_with_type || suggestion.data.settlement_with_type,
                      street: suggestion.data.street_with_type,
                      house: suggestion.data.house,
                      address: suggestion,
                      showSuggestions: false
                    })}
                  >
                    <Text style={[styles.regular, { color: "gray" }]}>
                      {suggestion.value}
                    </Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>
        }

        <TextInput
          editable={false}
          multiline
          style={[styles.input, { marginTop: 40 }]}
          placeholder="Индекс"
          value={this.state.postalCode ? this.state.postalCode : ""}
        />
        <TextInput
          editable={false}
          multiline
          style={styles.input}
          placeholder="Регион/район"
          value={this.state.region ? this.state.region : ""}
        />
        <TextInput
          editable={false}
          multiline
          style={styles.input}
          placeholder="Город/н.п"
          value={this.state.city ? this.state.city : ""}
        />
        <TextInput
          editable={false}
          multiline
          style={styles.input}
          placeholder="Улица"
          value={this.state.street ? this.state.street : ""}
        />
        <TextInput
          editable={false}
          multiline
          style={styles.input}
          placeholder="Дом"
          value={this.state.house ? this.state.house : ""}
        />

        {
          // this.state.postalCode.length > 0 &&
          // this.state.region.length > 0 &&
          // this.state.city.length > 0 &&
          // this.state.street.length > 0 &&
          // this.state.house.length > 0 &&
          this.state.input
          ? (
            <View style={{ marginTop: 40 }}>
              <Button
                text="Добавить"
                onPress={async () => {
                  this.setState({ loading: true });

                  let body = {};
                  const { address } = this.state;
                  const { data } = address;

                  let res = await checkProfileNetworkRequest();

                  body["object_id"] = res.person.id;
                  body["object"] = "people";
                  body["postalcode"]= data.postal_code;
                  body["top_aoid"]= data.region_fias_id;
                  body["city"]= data.city ? data.city : data.settlement;
                  body["addstring"]= address.unrestricted_value;
                  body["more"]= "";
                  body["address.01"]= data.area_fias_id ? data.area_fias_id  : data.region_fias_id ;
                  body["address.011"]= data.city_fias_id ? data.city_fias_id : data.settlement_fias_id;
                  body["address.0111"]= data.street_fias_id;
                  body["address.01111"]= data.house_fias_id;
                  body["addpath"]= body["top_aoid"] + ' ' +
                                  body["address.01"] + ' ' +
                                  body["address.011"] + ' ' +
                                  body["address.0111"] + ' ' +
                                  body["address.01111"];

                  res = await addUserAddressRequest(body);

                  this.setState({ loading: false });

                  this.props.navigation.state.params.addAddress({
                    ...body,
                    id: Date.now(),
                    addrstring: body.addstring
                  });
                  this.props.navigation.goBack();
                }}
              />
            </View>
          )
          : null
        }
      </ScrollView>
    );
  }
}

AddAddressScreen.navigationOptions = ({ navigation }) => ({
  headerStyle: {
    backgroundColor: colors.colorPrimary,
    height: 80,
  },

  headerTitle: () => (
    <PriceDetailHeader
      color="white"
      title="Добавить адрес"
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

  iosHeaderCenter: {
    height: "100%",
    alignItems: "center",
    marginBottom: 5,
    marginRight: 15,
  },

  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5
  },

  bold: { fontWeight: "bold" },

  regular: { fontSize: 15 },

  input: {
    height: 40,
    fontSize: 16,
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 5,
    color: "lightgray"
  }
})

