import { handleActions } from "redux-actions";
import {
  getShopsRequest,
  getAllShopsSuccess,
  getShopsFailure,
  getAllShopsSearchSuccess,
  getUserShopsSuccess,
  getAllCityShopsSuccess,
} from "./actions";

const initialState = {
  fetching: false,
  shops: null,
  status: "",
  error: "",
  shopsSearch: null,
  userShops: [],
  cityShops: null,
};

export const shops = handleActions(
  {
    [getShopsRequest](state) {
      return {
        ...state,
        fetching: true,
      };
    },
    [getAllShopsSuccess](state, { payload }) {
      return {
        ...state,
        fetching: false,
        status: "got+",
        shops: payload.shops,
      };
    },
    [getAllShopsSearchSuccess](state, { payload }) {
      return {
        ...state,
        shopsSearch: payload.shopsSearch,
      };
    },
    [getUserShopsSuccess](state, { payload }) {
      return {
        ...state,
        userShops: payload.userShops,
      };
    },
    [getAllCityShopsSuccess](state, { payload }) {
      return {
        ...state,
        cityShops: payload.cityShops,
      };
    },
    [getShopsFailure](state, { payload }) {
      return {
        ...state,
        fetching: false,
        error: payload.error,
      };
    },
  },
  initialState
);