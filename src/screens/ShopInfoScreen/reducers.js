import { handleActions } from "redux-actions";
import {
  getShopInfoRequest,
  getShopPricesRequest,
  getShopInfoSuccess,
  getShopPricesSuccess,
  getShopInfoFailure,
  getShopPricesFailure,
  addClientFailure,
  addClientSuccess,
  addClientRequest,
  deleteShopRequest,
  deleteShopFailure,
  deleteShopSuccess,
} from "./actions";

const initialState = {
  fetching: false,
  shop: null,
  prices: null,
  status: "",
  error: "",
};

export const userShopPrices = handleActions(
  {
    [addClientRequest](state) {
      return {
        ...state,
        fetching: true,
      }
    },
    [deleteShopRequest](state) {
      return {
        ...state,
        fetching: true,
      }
    },
    [getShopPricesRequest](state) {
      return {
        ...state,
        fetching: true,
      };
    },
    [getShopInfoRequest](state) {
      return {
        ...state,
        fetching: true,
      };
    },
    [addClientSuccess](state, { payload }) {
      return {
        ...state,
        fetching: false,
        status: payload.status,
      }
    },
    [deleteShopSuccess](state, { payload }) {
      return {
        ...state,
        fetching: false,
        status: payload.status,
      }
    },
    [getShopPricesSuccess](state, { payload }) {
      return {
        ...state,
        fetching: false,
        status: "got",
        prices: payload.prices,
      };
    },
    [getShopInfoSuccess](state, { payload }) {
      return {
        ...state,
        status: "got shop",
        shop: payload.shop,
      }
    },
    [addClientFailure](state, { payload }) {
      return {
        ...state,
        fetching: false,
        error: payload.error,
      }
    },
    [deleteShopFailure](state, { payload }) {
      return {
        ...state,
        fetching: false,
        error: payload.error,
      }
    },
    [getShopInfoFailure](state, { payload }) {
      return {
        ...state,
        fetching: false,
        error: payload.error,
      };
    },
    [getShopPricesFailure](state, { payload }) {
      return {
        ...state,
        fetching: false,
        error: payload.error,
      };
    },
  },
  initialState
);
