import React from "react";
import { TouchableOpacity, View } from "react-native";
import { withNavigation } from "react-navigation";

import { ORDER_DETAIL_SCREEN, SHOP_INFO_SCREEN } from "../../../constants";

import { Photo, TitleText } from "../../MainScreen/components";
import { Container, Name } from "../../../components";

const Item = ({ cart, onRefresh, navigation  }) => {
  const userShopList = [];
  return(
    <TouchableOpacity
      onPress={() => navigation.navigate(ORDER_DETAIL_SCREEN, {
        shopId: cart.shop.id,
        currencyId: cart.currency.id,
        cart: [],
        isControlSklad: cart.shop.iscontrolsklad,
        phoneRequire: cart.shop.isphonerequired,
        shop: cart.shop,
        onCartRefresh: onRefresh,
        saved: cart.saved,
      })}
    >
      <Container 
        style={{
          shadowOffset: {width: 5, height: 0},
          shadowColor: "rgba(0, 0, 0, 0.05)",
          shadowRadius: 5,
          shadowOpacity: 1,
        }}
        isViewed
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(SHOP_INFO_SCREEN, { 
              userShopList: userShopList,
              shop: cart.shop,
              allShops: !userShopList.includes(cart.shop),
              fromPrice: true, 
            });
          }}
        >
          <Photo shop={cart.shop}/>
        </TouchableOpacity>
        <View>
          <TitleText>{cart.shop.name}</TitleText>
          <Name>
            {cart.sum} {cart.currency.name}
          </Name>
        </View>
      </Container>
    </TouchableOpacity>  
  );
};

export default withNavigation(Item);
