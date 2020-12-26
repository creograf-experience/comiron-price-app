import { handleActions } from "redux-actions";

import {
  addProductToGroup,
  setProductsToGroup,
  clearProduct,
  getTotalPages,
  getNextPage,
} from "../screens/GroupScreen/actions";

const initialState = {
  products: [],
  totalpages: 0,
  nextpage: 1,
};

export const groupDetail = handleActions(
  {
    [addProductToGroup](state, { payload }) {
      return { ...state, products: state.products.concat(payload.product) };
    },
    [setProductsToGroup](state, { payload }) {
      return { ...state, products: payload.products };
    },
    [clearProduct](state, {}) {
      return { ...state, products: [] };
    },
    [getTotalPages](state, { payload }) {
      return { ...state, totalpages: payload.totalpages};
    },
    [getNextPage](state, { payload }) {
      return { ...state, nextpage: payload };
    },
  },
  initialState
);

