import { createAction } from "redux-actions";

export const setPrices = createAction("SET_PRICES");
export const setViewedPrices = createAction("SET_VIEWED_PRICES");
export const setViewedCoopPrices = createAction("SET_VIEWED_COOP_PRICES");
export const addPriceAction = createAction("ADD_PRICE_ACTION");
export const setCoopPrices = createAction("SET_COOP_PRICES");
export const renewPrices = createAction("RENEW_PRICES");
