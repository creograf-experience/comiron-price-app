import { handleActions } from "redux-actions";
import {
  setPrices,
  savePrice,
  saveCoopPrice,
  setViewedPrices,
  addPriceAction,
  setCoopPrices,
  setViewedCoopPrices,
  renewPrices,
} from "../actions";

const initialState = {
  prices: [],
  coopPrices: [],
  viewedPrices: [],
  viewedCoopPrices: [],
};

export const prices = handleActions(
  {
    [setPrices](state, { payload }) {
      const payloadFilter = payload.prices.map(price => price.id);
      const pricesFiltered = state.prices.filter(price => !payloadFilter.includes(String(price.id)));

      return { ...state, prices: pricesFiltered.concat(payload.prices)};
    },
    [renewPrices](state, { payload }) {
      return { ...state, prices: payload.prices };
    },
    [setViewedPrices](state, { payload }) {
      return { ...state, viewedPrices: payload.viewedPrices };
    },
    [addPriceAction](state, { payload }) {
      if (state.prices.includes(String(payload.newPrice.id))) {
        return { ...state };
      }
      return { ...state, prices: [...state.prices, payload.newPrice] };
    },
    [savePrice](state, { payload }) {
      const priceIndex = state.prices.findIndex(el => el.id === payload.id);
      const prices = state.prices;

      prices.splice(priceIndex, 1, payload);

      return { ...state, prices };
    },
    [saveCoopPrice](state, { payload }) {
      const priceIndex = state.prices.findIndex(el => el.id == payload.id); // updated for combined prices & coop prices
      const prices = state.prices;

      prices.splice(priceIndex, 1, payload);

      return { ...state, coopPrices: prices };
    },
    [setCoopPrices](state, { payload }) {
      return { ...state, coopPrices: payload.prices  }
    },
    [setViewedCoopPrices](state, { payload }) {
      return { ...state, viewedCoopPrices: payload.viewedPrices };
    },
  },
  initialState
);
