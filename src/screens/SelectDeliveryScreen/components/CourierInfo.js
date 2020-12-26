import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"

import { colors } from "../../../constants";

import { Button } from "../../../containers";

import { strings } from "../../../../locale/i18n";

export class CourierInfo extends Component {
  render() {
    const { shop } = this.props;

    const {
      delivery_cost,
      delivery_free_cost,
      delivery_order_cost_from,
      delivery_order_cost_to,
      cities_json
    } = shop;

    const cities = JSON.parse(cities_json);

    return(
      <View style={{ flex: 1 }}>
        <Text style={styles.header}>{strings("deliveryScreen.courierTerms")}</Text>

        <View style={{ paddingLeft: 20, marginBottom: 20 }}>
          <Text style={styles.regular}>{strings("cartScreen.deliveryCost")}{" "}
            <Text style={styles.bold}>
              {delivery_cost}
            </Text>
          </Text>

          <Text style={styles.regular}>
            {strings("deliveryScreen.orderingFrom")}{" "}
              <Text style={styles.bold}>{delivery_order_cost_from}</Text>
            {" "}{strings("deliveryScreen.to")}{" "}
              <Text style={styles.bold}>{delivery_order_cost_to}</Text>
          </Text>

          <Text style={styles.regular}>{strings("deliveryScreen.freeDeliveryFrom")}{" "}
            <Text style={styles.bold}>{delivery_free_cost}</Text>
          </Text>
        </View>

        <Text style={styles.header}>
          {strings("deliveryScreen.cityChoice")}
        </Text>
        <View style={{
          flex: 0,
          marginLeft: 20,
          flexDirection: "row",
          flexWrap: "wrap"
        }}>
          {cities.map(city =>
            <TouchableOpacity
              key={city}
              style={styles.courierCity(this.props.courierCity, city)}
              onPress={() => this.props.setCourierCity(
                this.props.courierCity === city
                  ? ""
                  : city
              )}
            >
              <Text style={styles.courierCityText(this.props.courierCity, city)}>
                {city}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View>
          {this.renderContinueButton()}
        </View>
      </View>
    );
  }

  renderContinueButton = () => {
    const { courierCity, userCity } = this.props;

    if (!courierCity.length) return null;

    if (
        courierCity.length &&
        !userCity ||
        courierCity.toLowerCase() !== userCity.toLowerCase()
    ) {
      return(
        <View style={{ marginLeft: 20, marginTop: 20 }}>
          <Text style={styles.regular}>
            {strings("deliveryScreen.noCityMatch")}
          </Text>
        </View>
      );
    }

    return(
      <View style={{ width: "45%", marginLeft: 20, marginTop: 20 }}>
        <Button
          text={strings("deliveryScreen.continue")}
          onPress={() => this.props.setDeliveryFields({
            deliverycost: this.props.shop.delivery_cost,
            deliveryFreeCost: this.props.shop.delivery_free_cost
          })}
        />
      </View>
    );
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

  courierCity: (selectedCity, city) => ({
    flex: 0,
    alignItems: "center",
    marginBottom: 5,
    marginRight: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderColor: colors.colorPrimary,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: selectedCity === city ? colors.colorPrimary : "white"
  }),

  courierCityText: (selectedCity, city) => ({
    fontSize: 15,
    textAlign: "center",
    color: selectedCity === city ? "white" : "black"
  })
})
