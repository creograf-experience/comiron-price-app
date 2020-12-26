import { handleActions } from "redux-actions";
import {
  addProductToPrice,
  setProductsToPrice,
  setNumOrdersProducts,
  clearPrice,
  addProductToCoopPrice,
  clearCoopPrice,
  setProductsToCoopPrice,
  addPriceGroups,
  addItemToCart,
  deleteItemToCart,
  showListItem,
  isClickItem,
  addCoopPriceGroups,
  addPropsGroups,
} from "../actions";

const initialState = {
  products: [],
  coopProducts: [],
  numOrdersProducts: [],
  groups: [],
  properties: [],
  coopGroups: [],
  cart: [],
  showList: true,
  isClick: false,
};

export const priceDetail = handleActions(
  {
    [addProductToPrice](state, { payload }) {
      return { ...state, products: state.products.concat(payload.product) };
    },
    [setProductsToPrice](state, { payload }) {
      return { ...state, products: payload.products };
    },
    [setNumOrdersProducts](state, { payload }) {
      return { ...state, numOrdersProducts: payload.numOrdersProducts };
    },
    [addPriceGroups](state, { payload }) {
      return { ...state, groups: payload.groups };
    },
    [addPropsGroups](state, { payload }) {
      return { ...state, properties: payload.properties };
    },
    [clearPrice](state, {}) {
      return { ...state, products: [] };
    },

    [addProductToCoopPrice](state, { payload }) {
      return { ...state, coopProducts: state.coopProducts.concat(payload.product) };
    },
    [setProductsToCoopPrice](state, { payload }) {
      return { ...state, coopProducts: payload.products };
    },
    [addCoopPriceGroups](state, { payload }) {
      return { ...state, coopGroups: payload.groups };
    },
    [clearCoopPrice](state, {}) {
      return { ...state, coopProducts: [] };
    },
    [addItemToCart](state, { payload }) {
      const payloadFilter = payload.cart.map(price => price.id);
      const pricesFiltered = state.cart.filter(price => !payloadFilter.includes(String(price.id)));
      return { ...state, cart: pricesFiltered.concat(payload.cart) };
    },
    [deleteItemToCart](state, { payload }) {
      return {...state, cart: state.cart.filter(cartItem => cartItem.id != payload.cart.id)}
    },
    [showListItem](state, { payload }) {
      return {...state, showList: payload.showList}
    },
    [isClickItem](state, { payload }) {
      return {...state, isClick: payload.isClick}
    },
  },
  initialState
);
