import { handleActions } from "redux-actions";

import {
  sendPhotoSuccess,
  sendPhotoFailure,
  addPhotoToProfile,
} from "../actions";

import { checkStandardCommentSuccess } from '../screens/StandardCommentScreen/actions'

const initialState = {
  sendPhotoResponse: "",
  sendPhotoError: "",
  phonePhoto: null,
  standardComment: "",
};

export const profile = handleActions(
  {
    [sendPhotoSuccess](state, { payload }) {
      return { ...state, sendPhotoResponse: payload };
    },
    [sendPhotoFailure](state, { payload }) {
      return { ...state, sendPhotoError: payload };
    },
    [addPhotoToProfile](state, { payload }) {
      return { ...state, phonePhoto: payload.phonePhoto };
    },
    [checkStandardCommentSuccess](state, { payload }) {
      return { ...state, standardComment:payload.standardComment };
    },
  },
  initialState
);