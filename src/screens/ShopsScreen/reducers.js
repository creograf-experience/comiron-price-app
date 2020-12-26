import { handleActions } from "redux-actions";
import {
  getShopsRequest,
  getUserShopsSuccess,
  getAllShopsSuccess,
  showAllShopsSuccess,
  getShopsFailure,
} from "./actions";

const initialState = {
  fetching: false,
  shops: null,
  allShops: null,
  status: "",
  error: "",
};

export const userShops = handleActions(
  {
    [getShopsRequest](state) {
      return {
        ...state,
        fetching: true,
      };
    },
    [getUserShopsSuccess](state, { payload }) {
      return {
        ...state,
        fetching: false,
        status: "got",
        shops: payload.shops,
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
    [showAllShopsSuccess](state, { payload }) {
      return {
        ...state,
        fetching: false,
        status: "show",
        allShops: payload.allShops,
      }
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
