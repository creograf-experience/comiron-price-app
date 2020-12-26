import { combineReducers } from "redux";
import {
  auth,
  prices,
  priceDetail,
  loading,
  order,
  groups,
  groupDetail,
  profile,
  clients,
  chats,
  messages,
  socket,
  contacts
} from "../reducers";
import { userShops } from "../screens/ShopsScreen/reducers";
import { userShopPrices } from '../screens/ShopInfoScreen/reducers';
import { logOutSuccess } from "../actions";
import { productProps } from "../screens/ProductDetailScreen/reducers";
import {shops} from "../screens/RecShopsScreen/reducers";

const rootReducer = combineReducers({
  auth,
  prices,
  priceDetail,
  loading,
  order,
  userShops,
  userShopPrices,
  productProps,
  groups,
  groupDetail,
  profile,
  clients,
  chats,
  messages,
  socket,
  contacts,
  shops
});

export default (state, action) => {
  let newState = state;

  if (action.type === logOutSuccess.toString()) {
    newState = undefined;
  }

  return rootReducer(newState, action);
};
