import { handleActions } from "redux-actions";

import {
  getUserTokenRequest,
  getUserTokenSuccess,
  getUserProfileRequest,
  getUserProfileSuccess,
  logOutRequest,
  logOutSuccess,
  sendOrderRequest,
  sendOrderSuccess,
  sendOrderFailure,
  setLoading,
} from "../actions";

import {
  registerRequest,
  registerSuccess,
  registerFailure,
} from "../screens/RegisterScreen/actions";

import {
  getPricesRequest,
  getPricesSuccess,
  getPricesFailure,
} from "../screens/MainScreen/actions";

import {
  getPriceDetailRequest,
  getPriceDetailSuccess,
  getPriceDetailFailure,
  getPriceGroupRequest,
  getPriceGroupSuccess,
  getPriceGroupFailure,
} from "../screens/PriceDetailScreen/actions";

import {
  getGroupRequest,
  getGroupSuccess,
  getGroupFailure,
} from "../screens/GroupScreen/actions";

import {
  getShopInfoRequest,
  getShopInfoSuccess,
  getShopInfoFailure,
} from "../screens/ShopInfoScreen/actions";

import {
  getAllOrderRequest,
  getAllOrderSuccess,
  getAllOrderFailure,
} from "../screens/AllOrderScreen/actions";
import { 
  getOrderRequest,
  getItemSuccess,
  getItemFailure,
 } from "../screens/AllOrderDetailScreen/actions";

 import {
  savePhotoRequest,
  savePhotoSuccess,
  savePhotoFailure,
 } from "../screens/ProfileScreen/actions";

const initialState = {
  loading: false,
};

export const loading = handleActions(
  {
    [setLoading](state, { payload }) {
      return { ...state, loading: payload };
    },
    // async storage
    [getUserTokenRequest](state, {}) {
      return { ...state, loading: true };
    },
    [getUserTokenSuccess](state, {}) {
      return { ...state, loading: false };
    },
    [getUserProfileRequest](state, {}) {
      return { ...state, loading: true };
    },
    [getUserProfileSuccess](state, {}) {
      return { ...state, loading: false };
    },
    [logOutRequest](state, {}) {
      return { ...state, loading: true };
    },
    [logOutSuccess](state, {}) {
      return { ...state, loading: false };
    },
    // register
    [registerRequest](state, {}) {
      return { ...state, loading: true };
    },
    [registerSuccess](state, {}) {
      return { ...state, loading: false };
    },
    [registerFailure](state, {}) {
      return { ...state, loading: false };
    },
    // list of prices
    [getPricesRequest](state, {}) {
      return { ...state, loading: true };
    },
    [getPricesSuccess](state, {}) {
      return { ...state, loading: false };
    },
    [getPricesFailure](state, {}) {
      return { ...state, loading: false };
    },
    // price detail
    [getPriceDetailRequest](state, {}) {
      return { ...state, loading: true };
    },
    [getPriceDetailSuccess](state, {}) {
      return { ...state, loading: false };
    },
    [getPriceDetailFailure](state, {}) {
      return { ...state, loading: false };
    },
    [getPriceGroupRequest](state, {}) {
      return { ...state, loading: true };
    },
    [getPriceGroupSuccess](state, {}) {
      return { ...state, loading: false };
    },
    [getPriceGroupFailure](state, {}) {
      return { ...state, loading: false };
    },
    // groups
    [getShopInfoRequest](state, {}) {
      return { ...state, loading: true };
    },
    [getShopInfoSuccess](state, {}) {
      return { ...state, loading: false };
    },
    [getShopInfoFailure](state, {}) {
      return { ...state, loading: false };
    },
    // groups detail
    [getGroupRequest](state, {}) {
      return { ...state, loading: true };
    },
    [getGroupSuccess](state, {}) {
      return { ...state, loading: false };
    },
    [getGroupFailure](state, {}) {
      return { ...state, loading: false };
    },
    // send order
    [sendOrderRequest](state, {}) {
      return { ...state, loading: true };
    },
    [sendOrderSuccess](state, {}) {
      return { ...state, loading: false };
    },
    [sendOrderFailure](state, {}) {
      return { ...state, loading: false };
    },
    //all orders
    [getAllOrderRequest](state, {}) {
      return { ...state, loading: true };
    },
    [getAllOrderSuccess](state, {}) {
      return { ...state, loading: false };
    },
    [getAllOrderFailure](state, {}) {
      return { ...state, loading: false };
    },
    //order detail
    [getOrderRequest](state, {}) {
      return { ...state, loading: true };
    },
    [getItemSuccess](state, {}) {
      return { ...state, loading: false };
    },
    [getItemFailure](state, {}) {
      return { ...state, loading: false };
    },
    // send photo
    [savePhotoRequest](state, {}) {
      return { ...state, loading: true };
    },
    [savePhotoSuccess](state, {}) {
      return { ...state, loading: false };
    },
    [savePhotoFailure](state, {}) {
      return { ...state, loading: false };
    },
  },
  initialState
);
