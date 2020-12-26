import React, { Component } from "react";
import Lightbox from "react-native-lightbox";
import {
    Platform,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    Image
  } from "react-native";
import { IconButton } from "./Button";
import {
    hostImages,
    colors
  } from "../constants";

export const NewBigImage = ({ image }) => {
    const { width, height } = Dimensions.get('window');
    return(
        <Lightbox 
            backgroundColor="white" 
            underlayColor="white" 
            swipeToDismiss={true}
            renderHeader={close => (
                <TouchableOpacity style={{ flex: 1, alignItems: "flex-end" }}>
                <IconButton
                        name={"ios-close-circle-outline"}
                        stylesContainer={{ marginRight: 10, marginTop: 10 }}
                        stylesIcon={{ fontSize: 30, color: colors.dataColor }}
                        onPress={close}
                    />
                </TouchableOpacity>
            )}
            >
                
            {
                Platform.OS === "ios" ? (
                <ScrollView
                    minimumZoomScale={1}
                    maximumZoomScale={3}
                    centerContent={true}
                >
                    <Image
                    style={{width:width,height:height*0.5,marginTop:10,marginBottom:10,justifyContent:'center'}}
                    source={{ uri: `${hostImages}${image}` }}
                    resizeMode={"contain"}
                    />
                </ScrollView>
                )
                : (
                <Image
                    style={{width:width,height:height*0.5,marginTop:10,marginBottom:10,justifyContent:'center'}}
                    source={{ uri: `${hostImages}${image}` }}
                    resizeMode={"contain"}
                />
                )
            }
        </Lightbox>
    )
};