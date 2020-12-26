import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView
} from "react-native"

import { colors } from "../../../constants";
import {
  DpdCitySearchRequest,
  calculateDpdCostRequest,
  getCartSiteNetworkRequest
} from "../../../networkers";

import { Spinner } from "../../../components";
import { Button } from "../../../containers";

import { strings } from "../../../../locale/i18n";

let timeOut;

const dpdTypes = [
  {
    name: 'toterm',
    cost: -1,
    calcName: 'calc',
    title: strings("deliveryScreen.terminalDelivery")
  },
  {
    name: 'todoor',
    cost: -1,
    calcName: 'calc2door',
    title: strings("deliveryScreen.doorDelivery")
  }
];

export class DpdInfo extends Component {
  state = {
    input: "",
    showSuggestions: true,
    suggestions: [],
    selectedDpdType: "",
    showDpdTypes: false,
    loading: false,
    dpdCityId: null,
    orderData: null,
    error: "",
    deliveryCost: null
  };

  render() {
    if (this.state.loading) {
      return <Spinner backgroundColor="white" />;
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
          {strings("deliveryScreen.dpdDeliveryCost")}
        </Text>

        {!this.props.userAddress &&
          <Text style={[styles.regular, styles.bold]}>
            {strings("deliveryScreen.dpdAdressChoice")}
          </Text>
        }

        <Text style={[styles.regular, styles.bold]}>
          {strings("deliveryScreen.dpdAdressChoice1")}
        </Text>
        <Text style={[styles.regular, styles.bold]}>
          {strings("deliveryScreen.dpdAdressChoice2")}
        </Text>

        <TextInput
          style={[styles.input, { borderColor: "gray", color: "gray", height: 60 }]}
          placeholder={strings("deliveryScreen.yourCity")}
          placeholderTextColor="gray"
          value={this.state.input}
          multiline
          onChangeText={text => {
            clearTimeout(timeOut);
            this.setState({ input: text, showDpdTypes: false });

            if (!text.length) {
              return this.setState({ showSuggestions: false, suggestions: [] });
            }

            timeOut = setTimeout(async () => {
              const res = await DpdCitySearchRequest(this.state.input);
              this.setState({
                showSuggestions: res.suggestions ? true : false,
                suggestions: res.suggestions || []
              });
            }, 800);
          }}
        />

        {
          this.state.suggestions.length > 0 && this.state.showSuggestions &&
            <View style={{
              flex: 1,
              borderWidth: 1,
              borderRadius: 5,
              borderColor: "gray",
              backgroundColor: "lightgray"
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
                      showSuggestions: false,
                      input: suggestion.value,
                      showDpdTypes: true,
                      dpdCityId: suggestion.data
                    })
                  }
                  >
                    <Text style={[styles.regular, { color: "gray" }]}>
                      {suggestion.value}
                    </Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>
        }

        <View style={{ marginTop: 20 }}>
          {this.state.showDpdTypes && dpdTypes.map(type =>
            <TouchableOpacity
              key={type.name}
              style={styles.dpdType(this.state.selectedDpdType, type.calcName)}
              onPress={async () => {
                this.setState({
                  selectedDpdType: type.calcName,
                  loading: true,
                  error: ""
                });
                const orderData = {
                  ...this.state.orderData,
                  cityid: this.state.dpdCityId,
                  deliverycity: this.state.dpdCityId
                };

                orderData.deliveryzip = orderData.deliveryzip
                  ? orderData.deliveryzip
                  : this.state.input.split('-').pop().trim();
 
                const res = await calculateDpdCostRequest(type.calcName, orderData);

                if (!res) return this.setState({
                  error: strings("deliveryScreen.deliveryCalcFailed"),
                  loading: false
                });

                this.setState({ deliveryCost: res, loading: false });
              }}
            >
              <Text style={styles.dpdTypeText(this.state.selectedDpdType, type.calcName)}>
                {type.title}
              </Text>
            </TouchableOpacity>
          )}

          <View style={{ marginLeft: 20, marginTop: 20, marginBottom: 20 }}>
            {this.state.error.length > 0 &&
              <Text style={styles.regular}>{this.state.error}</Text>
            }
            {this.state.deliveryCost &&
              <Text style={[styles.regular]}>
                {strings("cartScreen.deliveryCost")}{" "}
                <Text style={[styles.regular, styles.bold]}>
                  {this.state.deliveryCost} {strings("cartScreen.currency")}
                </Text>
              </Text>
            }
          </View>
        </View>

        {this.state.deliveryCost &&
          <Button
            text={strings("deliveryScreen.continue")}
            onPress={() => this.props.setDeliveryFields({
              deliverycost: this.state.deliveryCost,
              cityid: this.state.dpdCityId,
              dpddeliverytype: this.state.selectedDpdType,
              ...this.state.orderData
            })}
          />
        }
      </ScrollView>
    );
  }

  async componentDidMount() {
    try {
      this.setState({ loading: true });

      if (this.props.userAddress) {
        const res = await DpdCitySearchRequest(this.props.userAddress.city);
        this.setState({
          showSuggestions: res.suggestions ? true : false,
          suggestions: res.suggestions || [],
          input: this.props.userAddress.city
        });
      }

      const res = await getCartSiteNetworkRequest(this.props.shop.id);

      const cart = res.cart.cart;
      const orderCost = this.getOrderSum(cart);
      const orderDimensions = this.getOrderDimensions(cart);

      this.setState({ orderData: {
        dpdAddressInput: this.state.input,
        declaredValue: orderCost,
        pickupcity: res.shop_addresses[0].city,
        deliveryzip: this.props.userAddress && this.props.userAddress.postalcode,
        pickupzip: res.shop_addresses[0].postalcode,
        ...orderDimensions
      }});

    } catch (err) {
      console.warn(err)
    } finally {
      this.setState({ loading: false });
    }
  }

  calculateDpdCost = async () => {}

  getOrderDimensions = cart => cart.reduce((acc, item) => {
    if (item.product.freedelivery === '1') {
      item.product.weight = 0;
      item.product.w = 0;
      item.product.h = 0;
      item.product.d = 0;
    }

    acc.weight += item.product.weight * item.num;
    acc.volume += item.product.volume * item.num;
    acc.h += item.product.h * item.num;
    acc.w += item.product.w * item.num;
    acc.d += item.product.d * item.num;

    return acc;
  }, { weight: 0, volume: 0, h: 0, w: 0, d: 0 });

  getOrderSum = cart => cart.reduce((acc, item) => {
    const { kratnost } = item.product;

    if (kratnost && item.num >= kratnost && kratnost != 0 && item.product.kratnostprice) {
      const measurableCount = item.num % kratnost;
      const packagesCount = item.num - measurableCount;

      const packagesSum = packagesCount * item.product.kratnostprice;
      const measurableSum = measurableCount * item.product.price;

      return acc += packagesSum + measurableSum;
    }

    return acc += item.product.price * item.num;
  }, 0);

}

const styles = StyleSheet.create({
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
  },

  dpdType: (selectedType, type) => ({
    flex: 0,
    alignItems: "center",
    marginBottom: 5,
    marginRight: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderColor: colors.colorPrimary,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: selectedType === type ? colors.colorPrimary : "white"
  }),

  dpdTypeText: (selectedType, type) => ({
    fontSize: 15,
    textAlign: "center",
    color: selectedType === type ? "white" : "black"
  })
})
