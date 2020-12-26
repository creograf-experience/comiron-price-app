import { createAction } from "redux-actions";

import {
  addProductToPrice,
  setNumOrdersProducts,
  addPriceGroups,
  addItemToCart,
  deleteItemToCart,
  isClickItem,
  showListItem,
  addPropsGroups,
} from "../../actions";

import {
  getPriceDetailNetworkRequest,
  postViewedPricesNetworkRequest,
} from "../../networkers";

export const getPriceDetailRequest = createAction("GET_PRICE_DETAIL_REQUEST");
export const getPriceDetailSuccess = createAction("GET_PRICE_DETAIL_SUCCESS");
export const getPriceDetailFailure = createAction("GET_PRICE_DETAIL_FAILURE");

export const postViewPricesRequest = createAction("POST_VIEW_PRICES_REQUEST");
export const postViewPricesSuccess = createAction("POST_VIEW_PRICES_SUCCESS");
export const postViewPricesFailure = createAction("POST_VIEW_PRICES_FAILURE");

export const getPriceGroupRequest = createAction("GET_PRICE_GROUP_REQUEST");
export const getPriceGroupSuccess = createAction("GET_PRICE_GROUP_SUCCESS");
export const getPriceGroupFailure = createAction("GET_PRICE_GROUP_FAILURE");

export const getPriceGroup = (shopId, priceId, userId) => async (
  dispatch,
) => {
  dispatch(getPriceGroupRequest());
  try {
    const response = await getPriceDetailNetworkRequest(
      shopId,
      priceId,
      userId,
    );
    const groups = response.data.groups ? Object.values(response.data.groups) : [];
    dispatch(addPriceGroups({ groups }));
    const properties = response.data.productproperties ? Object.values(response.data.productproperties) : [];
    dispatch(addPropsGroups({ properties }));
    dispatch(getPriceGroupSuccess());
  } catch (e) {
    dispatch(getPriceGroupFailure());
  }
};

export const getPriceProducts = (shopId, priceId, userId, page) => async (
  dispatch,
) => {
  dispatch(getPriceDetailRequest());
  try {
    const response = await getPriceDetailNetworkRequest(
      shopId,
      priceId,
      userId,
      page,
    );
    const numOrdersProducts = response.data.products.map(el => {
      if (el.num_orders) {
        return {
          id: el.id,
          numOrders: el.num_orders,
        };
      }
    });
    const groups = response.data.groups ? Object.values(response.data.groups) : [];
    dispatch(addPriceGroups({ groups }));

    const properties = response.data.productproperties ? Object.values(response.data.productproperties) : [];
    dispatch(addPropsGroups({ properties }));
    
    dispatch(setNumOrdersProducts({ numOrdersProducts }));
    const res = response.data.products;

    const product=res.map(el=> ({
      ...el.product,
      num_orders_sz: el.num_orders_sz,
      currency: el.currency,
    }));

    product.forEach(async product=> {
      dispatch(addProductToPrice({ product}));
    });

    dispatch(getPriceDetailSuccess());
  } catch (e) {
    dispatch(getPriceDetailFailure());
  }
};

export const postViewPrices = (price_id, person_id) => async (dispatch) => {
  dispatch(postViewPricesRequest());
  try {
    const response = await postViewedPricesNetworkRequest(price_id, person_id);
    dispatch(postViewPricesSuccess(response.status));
  } catch (e) {
    dispatch(postViewPricesFailure());
  }
};

export const setPriceGroups = groups => dispatch => {
  dispatch(addPriceGroups({ groups: Object.values(groups) }))
};

export const addCart = cart => dispatch => {
  dispatch(addItemToCart({ cart }));
};

export const deleteItemCart = cart => dispatch => {
  dispatch(deleteItemToCart({ cart }));
};

export const showListClick = showList => dispatch => {
  dispatch(showListItem({ showList }));
};

export const isClickCheck = isClick => dispatch => {
  dispatch(isClickItem({ isClick }));
};