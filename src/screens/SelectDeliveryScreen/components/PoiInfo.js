import React, { Component } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import MapView, { Marker } from "react-native-maps";

import { colors } from "../../../constants";

import { getShopPOIsRequest } from "../../../networkers";

import { Spinner } from "../../../components";
import { Button } from "../../../containers";

import { strings } from "../../../../locale/i18n";

export class PoiInfo extends Component {
  state = {
    region: {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    },
    pointOfIssues: [],
    cities: [],
    selectedPointOfIssue: null,
    selectedCity: "",
    loading: false
  };

  markers = [];

  render() {
    const {
      delivery_poi_cost,
      delivery_poi_cost_from,
      delivery_poi_cost_to,
      delivery_poi_free_cost
    } = this.props.shop;

    if (this.state.loading) {
      return <Spinner backgroundColor="white" />
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
        {this.renderMap()}
        <Text style={styles.header}>{strings("deliveryScreen.deliveryTerms")}</Text>

        <View style={{ paddingLeft: 20, marginBottom: 20 }}>
          <Text style={styles.regular}>{strings("cartScreen.deliveryCost")}{" "}
            <Text style={styles.bold}>
              {delivery_poi_cost}
            </Text>
          </Text>

          <Text style={styles.regular}>
            {strings("deliveryScreen.oredringFrom")}{" "}
              <Text style={styles.bold}>{delivery_poi_cost_from}</Text>
            {" "}{strings("deliveryScreen.to")}{" "}
              <Text style={styles.bold}>{delivery_poi_cost_to}</Text>
          </Text>

          <Text style={styles.regular}>{strings("deliveryScreen.freeDeliveryFrom")}{" "}
            <Text style={styles.bold}>{delivery_poi_free_cost}</Text>
          </Text>
        </View>

        {this.renderComment()}
        {this.renderCities()}
        {this.renderPointsOfIssue()}

        {this.state.selectedPointOfIssue &&
          <Button
            text={strings("deliveryScreen.continue")}
            onPress={() => this.props.setDeliveryFields({
              poiAddress: `${this.state.selectedPointOfIssue.address} / ${this.state.selectedCity}`,
              deliverycost: this.props.shop.delivery_poi_cost,
              deliveryFreeCost: this.props.shop.delivery_poi_free_cost
            })}
          />
        }
      </ScrollView>
    );
  }

  async componentDidMount() {
    try {
      this.setState({ loading: true });

      const { pointofissue } = await getShopPOIsRequest(this.props.shop.id);
      if (!pointofissue) return;

      const cities = Array.from(new Set(pointofissue.map(poi => poi.city)));
      const selectedCity = cities[0];
      const filteredPointOfIssues = pointofissue.filter(poi => poi.city === selectedCity);

      this.setState({
        pointOfIssues: pointofissue,
        cities,
        selectedCity,
        region: {
          ...this.state.region,
          latitude: +filteredPointOfIssues[0].coordy,
          longitude: +filteredPointOfIssues[0].coordx,
        }
      });

    } catch (err) {
      console.warn(err);
    } finally {
      this.setState({ loading: false });
    }
  }

  renderMap = () => {
    if (!this.state.selectedCity) return null;

    const filteredPointOfIssues = this.filterPointsOfIssue();

    return(
      <MapView
        style={{ flex: 1, marginBottom: 20, height: 350 }}
        region={this.state.region}
      >
        {filteredPointOfIssues.map(poi =>
          <Marker
            ref={ref => this.markers.push({ id: poi.id, ref })}
            key={poi.id}
            coordinate={{ latitude: +poi.coordy, longitude: +poi.coordx }}
            title={poi.address}
            onPress={() => this.setState({
              selectedPointOfIssue: poi,
              region: {
                ...this.state.region,
                latitude: +poi.coordy,
                longitude: +poi.coordx,
              }
            })}
          />
        )}
      </MapView>
    );
  }

  renderComment = () => {
    if (
      !this.state.selectedPointOfIssue ||
      this.state.selectedPointOfIssue && !this.state.selectedPointOfIssue.comment
    ) {
      return null;
    }

    return(
      <>
        <Text style={styles.header}>{strings("deliveryScreen.comment")}</Text>

        <View style={{ paddingLeft: 20, marginBottom: 20 }}>
          <Text style={styles.regular}>
            {this.state.selectedPointOfIssue.comment}
          </Text>
        </View>
      </>
    );
  }

  renderCities = () => {
    return(
      <>
        <Text style={styles.header}>{strings("deliveryScreen.city")}</Text>
        <View style={{
          flex: 0,
          marginLeft: 20,
          marginBottom: 20,
          flexDirection: "row",
          flexWrap: "wrap"
        }}>
          {this.state.cities.map(city =>
            <TouchableOpacity
              key={city}
              style={styles.poiCity(this.state.selectedCity, city)}
              onPress={() => {
                const filteredPointOfIssues = this.state.pointOfIssues.filter(poi => poi.city === city);

                this.setState({
                  selectedCity: city,
                  selectedPointOfIssue: null,
                  region: {
                    ...this.state.region,
                    latitude: +filteredPointOfIssues[0].coordy,
                    longitude: +filteredPointOfIssues[0].coordx,
                  }
                })
              }}
            >
              <Text style={styles.poiCityText(this.state.selectedCity, city)}>
                {city}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </>
    );
  }

  renderPointsOfIssue = () => {
    const filteredPointOfIssues = this.filterPointsOfIssue();

    const selectedPointOfIssue = !!this.state.selectedPointOfIssue
      ? this.state.selectedPointOfIssue
      : ""

    return(
      <>
        <Text style={styles.header}>{strings("deliveryScreen.deliveryPointChoice")}</Text>
        <View style={{
          flex: 0,
          marginLeft: 20,
          marginBottom: 20,
          flexDirection: "row",
          flexWrap: "wrap"
        }}>
          {filteredPointOfIssues.map(poi =>
            <TouchableOpacity
              key={poi.id}
              style={styles.poiCity(selectedPointOfIssue.id, poi.id)}
              onPress={() => {
                const marker = this.markers.find(marker => marker.id === poi.id);
                marker.ref.showCallout();

                this.setState({
                  selectedPointOfIssue: poi,
                  region: {
                    ...this.state.region,
                    latitude: +poi.coordy,
                    longitude: +poi.coordx,
                  }
                });
              }}
            >
              <Text style={styles.poiCityText(selectedPointOfIssue.id, poi.id)}>
                {poi.address}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </>
    );
  }

  filterPointsOfIssue = () => this.state.pointOfIssues.filter(
    poi => poi.city === this.state.selectedCity
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5
  },

  bold: { fontWeight: "bold" },

  regular: { fontSize: 15 },

  poiCity: (selectedCity, city) => ({
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

  poiCityText: (selectedCity, city) => ({
    fontSize: 15,
    textAlign: "center",
    color: selectedCity === city ? "white" : "black"
  })
})
