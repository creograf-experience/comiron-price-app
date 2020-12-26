import { handleActions } from "redux-actions";
import { deleteAccessToken, setAccessToken, setError } from "../actions";
import { checkProfileSuccess,addPhone, addPerson} from "../screens/AuthenticationScreen/actions";

const initialState = {
  accessToken: "",
  error: "",
  checkId: "",
  phone:"",
  person: {}
};

export const auth = handleActions(
  {
    [setAccessToken](state, { payload }) {
      return { ...state, accessToken: payload.token };
    },
    [setError](state, { payload }) {
      return { ...state, error: payload.error };
    },
    [deleteAccessToken](state) {
      return { ...state, accessToken: "" };
    },
    [checkProfileSuccess](state, { payload }) {
      return { ...state, checkId: payload.checkId };
    },
    [addPhone](state, {payload}) {
      return { ...state, phone: payload.phone}
    },
    [addPerson](state, { payload }) {
      return {...state, person: payload.person}
    }
  },
  initialState
);
