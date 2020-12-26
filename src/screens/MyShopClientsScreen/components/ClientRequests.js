import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
} from "react-native";
import { connect } from "react-redux";

import {
  acceptClient,
  rejectClient,
  setClients,
  setLoading,
} from "../../../actions";
import {
  acceptClientRequest,
  rejectClientRequest,
  fetchAllShopClients,
} from "../../../networkers";

import { Separator } from "../../MainScreen/components/Separator";
import Header from "./Header";
import ClientName from "./ClientName";
import ProfileImage from "./ProfileImage";
import { AcceptRequestBtn, DeclineRequestBtn } from "./Buttons";
import { strings } from "../../../../locale/i18n";

class ClientRequests extends React.Component {
  render() {
    if (!this.props.clientsRequests.length) return null;

    return(
      <View>
        <Header text={strings("profile.requests")} />
        <RequestList
          requests={this.props.clientsRequests}
          shopId={this.props.shopId}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  clientsRequests: state.clients.clientsRequests
});

export default connect(mapStateToProps, null)(ClientRequests);

const RequestList = ({ requests, shopId }) => {
  return(
    <FlatList
      data={requests}
      keyExtractor={item => String(item.id)}
      renderItem={({ item, index }) =>
        <>
          <Separator />
          <ConnectedRequestItem
            request={item}
            shopId={shopId}
          />
            {index === requests.length - 1 && <Separator />}
        </>
      }
    />
  );
}

class RequestItem extends React.Component {
  render() {
    const { request } = this.props;

    return(
      <View style={{ margin: 10 }}>
        <View style={styles.row}>
          <ProfileImage url={request.thumbnail_url} />

          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <ClientName
              text={`${request.first_name} ${request.last_name}`}
              containerStyle={{ marginBottom: 10 }}
            />

            <View style={styles.row}>
              <AcceptRequestBtn
                onPress={() => this.acceptRequest(request)}
                containerStyle={{ marginRight: 10 }}
              />
              <DeclineRequestBtn
                onPress={() => this.declineRequest(request)}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }

  acceptRequest = async request => {
    try {
      const {
        shopId,
        acceptClient,
        setClients,
        setLoading,
      } = this.props;

      setLoading(true);

      const response = await acceptClientRequest(shopId, request.id);

      if (response.status === "OK") {
        const { clients } = await fetchAllShopClients(shopId);
        setClients(clients);
        acceptClient(request);
      }

      setLoading(false);

    } catch (err) {
      console.warn(err);
      this.props.setLoading(false)
    }
  }

  declineRequest = async request => {
    try {
      const { shopId, rejectClient } = this.props;
      const response = await rejectClientRequest(shopId, request.id);

      if (response.status === "OK") {
        rejectClient(request);
      }

    } catch (err) {
      console.warn(err);
    }
  }
}

const ConnectedRequestItem = connect(
  null,
  { acceptClient, rejectClient, setClients, setLoading }
)(RequestItem);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
});
