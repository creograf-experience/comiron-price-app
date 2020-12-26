import React from "react";
import {
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";

import { colors } from "../../../constants";

class TagList extends React.Component {
  state = {
    selectedTags: [],
  };

  render() {
    const { tags } = this.props;
    const { selectedTags } = this.state;

    if (!tags || !tags.length) return null;

    return(
      <ScrollView
        contentContainerStyle={[
          {
            paddingBottom: 15,
            paddingHorizontal: 10,
            flex: 1,
            flexWrap: "wrap",
          },
          this.props.containerStyle
        ]}
        horizontal
        nestedScrollEnabled
        keyboardShouldPersistTaps="always"
      >
        {
          tags.map(tag =>
            <Tag
              handleSelectTag={this.handleSelectTag}
              selectedTags={selectedTags}
              disabled={this.props.disabled}
              key={tag.id}
              tag={tag}
            />
          )
        }
      </ScrollView>
    );
  }

  componentDidMount() {
    if (this.props.defaultSelected) {
      this.setState({ selectedTags: this.props.defaultSelected });
      this.props.onTagPress(this.props.defaultSelected);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.clients.length !== this.props.clients.length) {
      this.setState({ selectedTags: [] });
    }
  }

  handleSelectTag = tag => {
    const existingTag = this.state.selectedTags.includes(tag.id);
    let selectedTags = this.state.selectedTags;

    if (!existingTag) {
      selectedTags = [...selectedTags, tag.id];
      this.setState({ selectedTags });
      this.props.onTagPress(selectedTags);
      return;
    }

    selectedTags = selectedTags.filter(selectTag => selectTag !== tag.id);
    this.setState({ selectedTags });
    this.props.onTagPress(selectedTags);
  }
};

const mapStateToProps = state => ({
  clients: state.clients.clients,
});
const connectedTagList = connect(mapStateToProps, null)(TagList);
export { connectedTagList as TagList };

export class Tag extends React.Component {
  render() {
    const { tag, disabled, selectedTags } = this.props;
    const isSelected = selectedTags.includes(tag.id);

    return(
      <TouchableOpacity
        onPress={() => this.props.handleSelectTag(tag)}
        disabled={disabled}
        style={[
          {
            marginRight: 10,
            marginBottom: 5,
            borderWidth: 1,
            borderColor: colors.colorPrimary,
            borderRadius: 25,
            paddingVertical: 5,
            paddingHorizontal: 10,
          },
          {
            backgroundColor: isSelected ? colors.colorPrimary : "white"
          }
        ]}
      >
        <Text style={{ color: isSelected ? "white" : "black" }}>
          {tag.tag}
        </Text>
      </TouchableOpacity>
    );
  }
}
