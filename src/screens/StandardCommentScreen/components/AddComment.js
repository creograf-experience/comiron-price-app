import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { colors } from "../../../constants";
import Modal from "react-native-modal";
import { IconButton, CommentTextInputContainer } from "../../../components";
import { strings } from "../../../../locale/i18n"

export const AddComment = ({ isVisible, closeModal, onChangeText, value, onPressSave }) => (
  <Modal isVisible={isVisible}
    onBackdropPress={closeModal}
  >
    <View style={styles.modal}>
      <View style={styles.layoutHeader}>
        <View style={styles.textHeader}>
          <Text style={{ color: colors.textColorPrimary, fontSize: 15 }}>{strings("profile.addStandardComment")}</Text>
        </View>
        <IconButton
          name={"close-circle-outline"}
          onPress={closeModal}
          stylesIcon={{ color: colors.textColorPrimary }}
          stylesContainer={styles.iconContainer}
        />
      </View>
      <CommentTextInputContainer>
        <TextInput
          style={{height: 100, textAlignVertical: "top"}}
          multiline
          fontSize={15}
          onChangeText={onChangeText}
          value={value}
          blurOnSubmit
        />
      </CommentTextInputContainer>
      <TouchableOpacity style={styles.layoutSaveButton} onPress={onPressSave}>
        <Text style={styles.buttonSave}>{strings("profile.saveStandardComment")}</Text>
      </TouchableOpacity>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modal: {
    backgroundColor: colors.background,
    borderRadius: 5,
  },
  layoutHeader: {
    backgroundColor: colors.colorPrimary,
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 10,
    paddingTop: 10,
    marginBottom: 10,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  textHeader: {
    flex: 6,
    marginLeft: 10,
    justifyContent: "center",
  },
  iconContainer: {
    flex: 1,
    alignItems: "flex-end",
    marginRight: 10,
    justifyContent: "center",
  },
  layoutSaveButton: {
    marginBottom: 5,
    marginTop: 5,
    alignItems: "center",
  },
  buttonSave: {
    borderWidth: 1,
    borderColor: colors.colorPrimary,
    color: colors.textColorPrimary,
    backgroundColor: colors.colorPrimary,
    fontWeight: "bold",
    fontSize: 12,
    padding: 5,
    justifyContent: "center",
    alignSelf: "center",
  },
})