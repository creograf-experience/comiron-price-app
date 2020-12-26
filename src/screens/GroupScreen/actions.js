import { createAction } from "redux-actions";

import {
  addItemToCart,
  deleteItemToCart,
  isClickItem,
  showListItem,
} from "../../actions";

import { getShopGroupNetworkRequest } from "../../networkers";

export const getGroupRequest = createAction("GET_GROUP_REQUEST");
export const getGroupSuccess = createAction("GET_GROUP_SUCCESS");
export const getGroupFailure = createAction("GET_GROUP_FAILURE");

export const setGroups = createAction("SET_GROUPS");
export const saveGroup = createAction("SAVE_GROUP");

export const addProductToGroup = createAction("ADD_PRODUCT_TO_GROUP");
export const setProductsToGroup = createAction("SET_PRODUCTS_TO_GROUP");

export const clearProduct = createAction("CLEAR_PRODUCT");

export const getTotalPages = createAction("GET_TOTAL_PAGES");
export const getNextPage = createAction("GET_NEXTPAGE");

export const getGroup = (groupID, page) => async dispatch => {
  dispatch(getGroupRequest());
  try {
    const groups = await getShopGroupNetworkRequest(groupID, page);
    const res = groups.products;
    const totalpages = groups.totalpages;
    const nextpage = groups.nextpage;
    const product = res.map(el => ({
      ...el,
      currency: el.currency,
    }));

    product.forEach(async product => {
      dispatch(addProductToGroup({ product }));
    });
    dispatch(getTotalPages({ totalpages }));
    dispatch(getNextPage({ nextpage }));
    dispatch(getGroupSuccess());
  } catch (error) {
    dispatch(getGroupFailure({ error }));
  }
};

export const renewGroup = (groupID, page) => async dispatch => {
  dispatch(getGroupRequest());
  try {
    const groups = await getShopGroupNetworkRequest(groupID, page);
    const res = groups.products;
    const product=res.map(el=> ({
      ...el,
      currency: el.currency,
    }));

    product.forEach(async product=> {
      dispatch(addProductToGroup({ product}));
    });
    dispatch(getGroupSuccess());
  } catch (error) {
    dispatch(getGroupFailure({ error }));
  }
};

export const addCart = cart => dispatch => {
  dispatch(addItemToCart({ cart }));
};

export const deleteItemCart = cart=>dispatch=>{
  dispatch(deleteItemToCart({ cart }));
};

export const showListClick = showList=>dispatch=>{
  dispatch(showListItem({ showList }));
};

export const isClickCheck=isClick=>dispatch=>{
  dispatch(isClickItem({ isClick }));
};