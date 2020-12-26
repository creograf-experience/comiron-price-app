import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native"

import { getCartSiteNetworkRequest, calculateRupostCostRequest } from "../../../networkers";

import { Spinner } from "../../../components";
import { Button } from "../../../containers";

import { strings } from "../../../../locale/i18n";

export class RussiaPostInfo extends Component {
  state = {
    loading: false,
    error: null,
    deliveryCost: null,
    orderWeight: null
  };

  render() {
    if (this.state.loading) {
      return <Spinner backgroundColor="white" />;
    }

    return(
      <View style={{ flex: 1 }}>
        <Text style={styles.header}>
          {strings("deliveryScreen.ruPostCost")}
        </Text>

        {this.state.deliveryCost &&
          <View style={{ marginLeft: 20 }}>
            <Text style={[styles.regular]}>
              {strings("cartScreen.deliveryCost")}{" "}
              <Text style={[styles.regular, styles.bold]}>
                {this.state.deliveryCost} {strings("cartScreen.currency")}
              </Text>
            </Text>

            <View style={{ width: "45%", marginTop: 20 }}>
              <Button
                text="Продолжить"
                onPress={() => this.props.setDeliveryFields({
                  deliverycost: this.state.deliveryCost,
                  weight: this.state.orderWeight
                })}
              />
            </View>
          </View>
        }

        {this.state.error &&
          <Text style={[styles.regular, { marginLeft: 20 }]}>{this.state.error}</Text>
        }
      </View>
    );
  }

  async componentDidMount() {
    try {
      const { userPostalCode } = this.props;

      if (!userPostalCode) {
        return this.setState({
          error: strings("deliveryScreen.ruPostError") +
                 strings("deliveryScreen.ruPostError1")
        });
      }

      this.setState({ loading: true });

      let res = await getCartSiteNetworkRequest(this.props.shop.id);
      const shopPostalCode = res.shop_addresses[0].postalcode;
      const orderWeight = res.cart.cart.reduce((acc, item) =>
        acc + item.num * item.product.weight, 0);

      if (orderWeight > 20) {
        return this.setState({
          error: strings("deliveryScreen.ruPostError2")
        });
      }
      
      res = await calculateRupostCostRequest(shopPostalCode, userPostalCode, orderWeight * 1000);

      const successResponses = res.filter(r => !r.error);
      if (!successResponses.length) {
        return this.setState({
          error: strings("deliveryScreen.ruPostError3")
        });
      }

      const allCosts = successResponses.map(res => res.paynds / 100);
      this.setState({ deliveryCost: Math.min(...allCosts), orderWeight });

    } catch (err) {
      console.warn(err);
      this.setState({
        error: strings("deliveryScreen.ruPostError3")
      });

    } finally {
      this.setState({ loading: false });
    }
  }
}

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5
  },

  bold: { fontWeight: "bold" },

  regular: { fontSize: 15 },
})
