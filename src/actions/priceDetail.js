import { createAction } from "redux-actions";

export const addProductToPrice = createAction("ADD_PRODUCT_TO_PRICE");
export const addProductToCoopPrice = createAction("ADD_PRODUCT_TO_COOP_PRICE");

export const setProductsToCoopPrice = createAction("SET_PRODUCTS_TO_COOP_PRICE");
export const setProductsToPrice = createAction("SET_PRODUCTS_TO_PRICE");

export const setNumOrdersProducts = createAction("SET_NUM_ORDERS_PRODUCTS");

export const clearPrice = createAction("CLEAR_PRICE");
export const clearCoopPrice = createAction("CLEAR_COOP_PRICE");

export const savePrice = createAction("SAVE_PRICE");
export const saveCoopPrice = createAction("SAVE_COOP_PRICE");

export const setCoopProducts = createAction("SET_COOP_PRODUCTS");

export const addPriceGroups = createAction("ADD_PRICE_GROUPS");
export const addCoopPriceGroups = createAction("ADD_COOP_PRICE_GROUPS");

export const addItemToCart = createAction("ADD_ITEM_TO_CART");
export const deleteItemToCart = createAction("DELETE_ITEM_TO_CART");

export const showListItem = createAction("SHOW_LIST_ITEM");
export const isClickItem = createAction("IS_CLICK_ITEM");

export const addPropsGroups = createAction("ADD_PROPS_GROUPS");