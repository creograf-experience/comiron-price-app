import React from "react";
import styled from "styled-components";
import ImageZoom from 'react-native-image-pan-zoom';

const UsualImage = styled.Image`
  width: 56;
  height: 56;
  margin-left: 10;
  resize-mode: contain;
`;

const BigImage = styled.Image`
  width: 350;
  height: 250;
  position: relative;
  margin-bottom: 10;
  margin-top: 10;
`;

export const ProductImage = ({ source, isBig}) => {
  return (
    isBig ? (
      <ImageZoom
        cropWidth={350}
        cropHeight={250}
        imageHeight={250}
        imageWidth={350}
      >
        <BigImage resizeMode={"contain"} source={source} />
      </ImageZoom>
    ) : (
      <UsualImage source={source} />
    )
  );
};

