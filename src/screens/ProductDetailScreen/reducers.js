import { handleActions } from "redux-actions";

import { addProductProps } from "./actions";

const initialState = {
  properties: [],
};

export const productProps = handleActions(
  {
    [addProductProps](state, { payload }) {
      return { ...state, properties: payload.properties };
    },
  },
  initialState
);