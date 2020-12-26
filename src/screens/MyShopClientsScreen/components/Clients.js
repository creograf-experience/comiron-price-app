import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { withNavigation } from "react-navigation";

import { deleteClient } from "../../../actions";
import { deleteClientRequest } from "../../../networkers";

import { CLIENT_INFO_SCREEN } from "../../../constants";

import { strings } from "../../../../locale/i18n";

import Header from "./Header";
import ClientName from "./ClientName";
import ProfileImage from "./ProfileImage";
import { DeleteClientBtn } from "./Buttons";
import { TagList } from "./TagList";
import { Separator } from "../../MainScreen/components/Separator";
import { TouchableOpacity } from "react-native-gesture-handler";

class Clients extends React.Component {
  state = {
    filteredClients: [],
  };

  render() {
    const { shop } = this.props;
    const { filteredClients } = this.state;

    return(
      <View>
        <Header text={strings("profile.clients")} />
        <TagList
          tags={shop.shop_tags}
          onTagPress={this.onTagPress}
        />
        <ClientList
          clients={filteredClients}
          shopId={shop.id}
          tags={shop.shop_tags}
          updateFilteredClients={this.updateFilteredClients}
        />
      </View>
    );
  }

  componentDidMount() {
    this.setState({ filteredClients: this.props.clients });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.clients.length !== this.props.clients.length) {
      this.setState({ filteredClients: this.props.clients });
    }
  }

  onTagPress = selectedTags => {
    if (!selectedTags.length) {
      this.setState({ filteredClients: this.props.clients });
      return;
    }

    const filteredClients = this.props.clients.filter(client => {
      for (const tag of client.tags ? client.tags : []) {
        if (selectedTags.includes(tag.id) && tag.ismy) return client;
      }
    });

    this.setState({ filteredClients });
  };

  updateFilteredClients = clients => this.setState({ filteredClients: clients });
}

const mapStateToProps = state => ({
  clients: state.clients.clients,
});

export default withNavigation(
  connect(mapStateToProps, null)(Clients)
);

const ClientList = ({ clients, shopId, tags, updateFilteredClients }) => {
  return(
    <FlatList
      data={clients}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item, index }) =>
        <>
          <Separator />
          <ConnectedClientItem
            client={item}
            shopId={shopId}
            tags={tags}
            updateFilteredClients={updateFilteredClients}
          />
          {index === clients.length - 1 && <Separator />}
        </>
      }
    />
  );
};

const ClientItem = ({
  client,
  tags,
  shopId,
  deleteClient,
  navigation,
  updateFilteredClients,
}) => {
  return(
    <View style={[ styles.row, styles.container ]}>
      <View style={styles.clientInfo}>
        <TouchableOpacity
          onPress={() => navigation.navigate(
            CLIENT_INFO_SCREEN,
            {
              client,
              tags,
              shopId,
              updateFilteredClients,
            }
          )}
          style={styles.row}
        >
          <ProfileImage url={client.thumbnail_url} />

          <View style={{ flex: 1 }}>
            <ClientName
              text={`${client.first_name} ${client.last_name}`}
              containerStyle={{ marginBottom: 10 }}
            />
            <TagList
              tags={client.tags && client.tags.filter(tag => tag.ismy)}
              disabled={true}
              containerStyle={{ paddingLeft: 0 }}
            />
          </View>
        </TouchableOpacity>
      </View>
      <DeleteClientBtn
        style={styles.deleteBtn}
        onPress={async () => {
          try {
            await deleteClientRequest(shopId, client.id);
            deleteClient(client);

          } catch (err) {
            console.warn(err);
          }
        }}
      />
    </View>
  );
};

const ConnectedClientItem = withNavigation(
  connect(null, { deleteClient })(ClientItem)
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  container: {
    flex: 1,
    margin: 10,
  },
  clientInfo: {
    flex: 1,
  },
  deleteBtn: {
    alignSelf: "flex-end",
    marginBottom: 30,
  },
});
