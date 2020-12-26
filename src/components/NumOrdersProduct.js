import React from "react";
import styled from "styled-components";
import { colors } from "../constants";
import { strings } from "../../locale/i18n";

const Container = styled.Text`
  padding-bottom: 5;
`;

const Text = styled.Text`
  font-size: 14;
  color: ${colors.dataColor};
`;

export const NumOrdersProduct = ({ num }) =>
  num ? (
    <Container>
      <Text>{strings("componentNumOrdersProduct.earlierOrder")} </Text>
      <Text>{parseFloat(num).toFixed(0)}</Text>
    </Container>
  )
  : null;

export const CoopNumOrdersProduct = ({ tobuy, num_orders_sz }) => (
  tobuy === num_orders_sz ? (
    <Container>
      <Text>{strings("componentNumOrdersProduct.needToBuy")} </Text>
      <Text style={{ fontSize: 16, fontWeight: "bold", color: "black" }}>{Number(tobuy).toFixed(0)}</Text>
      <Text>{"\n"}</Text>
      <Text>{strings("componentNumOrdersProduct.buy")} </Text>
      <Text>{Number(num_orders_sz).toFixed(0)}</Text>
    </Container>  
  ) : Number(tobuy - num_orders_sz).toFixed(2) < 0 ? (
      <Container>
        <Text>{strings("componentNumOrdersProduct.needToBuy")} </Text>
        <Text style={{ fontSize: 16, fontWeight: "bold", color: "black" }}>{Number(tobuy).toFixed(0)}</Text>
        <Text>{"\n"}</Text>
        <Text>{strings("componentNumOrdersProduct.buy")} </Text>
        <Text style={{ fontSize: 16, fontWeight: "bold", color: "black" }}>{"\t" + "\t" + Number(num_orders_sz).toFixed(0)}</Text>
        <Text>{"\n"}</Text>
        <Text style={{ fontSize: 14, color: "black"}}>({strings("componentNumOrdersProduct.guarantee")})</Text>
        <Text>{"\n"}</Text>
        <Text>{strings("componentNumOrdersProduct.leftToBuy")} </Text>
        <Text style={{ fontSize: 14, color: "black" }}>{strings("componentNumOrdersProduct.guaranteeBuy")}</Text>
      </Container>
    ) : (
      <Container>
        <Text>{strings("componentNumOrdersProduct.needToBuy")} </Text>
        <Text style={{ fontSize: 16, fontWeight: "bold", color: "black" }}>{Number(tobuy).toFixed(0)}</Text>
        <Text>{"\n"}</Text>
        <Text>{strings("componentNumOrdersProduct.buy")} </Text>
        <Text style={{ fontSize: 16, fontWeight: "bold", color: "black" }}>{Number(num_orders_sz).toFixed(0)}</Text>
        <Text>{"\n"}</Text>
        <Text>{strings("componentNumOrdersProduct.leftToBuy")} </Text>
        <Text style={{ fontSize: 16, fontWeight: "bold", color: "black" }}>{Number(tobuy - num_orders_sz).toFixed(0)}</Text>
      </Container>
    )
);
