import { createAction } from "redux-actions";

import { addProductToCoopPrice, addCoopPriceGroups } from "../../../actions";

import {
  getPriceDetailRequest,
  getPriceDetailSuccess,
  getPriceDetailFailure,
} from "../../PriceDetailScreen/actions";

import {
  getPriceDetailNetworkRequest,
  addItemSZ_InSiteNetworkRequest,
  setItemSZ_CountInSiteNetworkRequest,
  deleteCartSZ_SiteNetworkRequest,
} from "../../../networkers";

export const addItemSZ_SiteRequest = createAction("ADD_ITEM_SZ_SITE_REQUEST");
export const addItemSZ_SiteSuccess = createAction("ADD_ITEM_SZ_SITE_SUCCESS");
export const addItemSZ_SiteFailure = createAction("ADD_ITEM_SZ_SITE_FAILURE");

export const setItemSZ_CountSiteRequest = createAction("SET_ITEM_SZ_COUNT_SITE_REQUEST");
export const setItemSZ_CountSiteSuccess = createAction("SET_ITEM_SZ_COUNT_SITE_SUCCESS");
export const setItemSZ_CountSiteFailure = createAction("SET_ITEM_SZ_COUNT_SITE_FAILURE");

export const deleteItemSZ_SiteRequest = createAction("DELETE_ITEM_SZ_SITE_REQUEST");
export const deleteItemSZ_SiteSuccess = createAction("DELETE_ITEM_SZ_SITE_SUCCESS");
export const deleteItemSZ_SiteFailure = createAction("DELETE_ITEM_SZ_SITE_FAILURE");

export const addItemSZ_Site = (id, num, price_id, source, is_sz, enddate, token, refreshToken) => async (dispatch) => {
  dispatch(addItemSZ_SiteRequest());
  try {
    const response = await addItemSZ_InSiteNetworkRequest(id, num, price_id, source, is_sz, enddate, token, refreshToken);
    dispatch(addItemSZ_SiteSuccess());
  } catch(e) {
    dispatch(addItemSZ_SiteFailure());
  };
};

export const setItemSZ_CountSite = (id, num, price_id, source, is_sz, enddate, token, refreshToken) => async (dispatch) => {
  dispatch(setItemSZ_CountSiteRequest());
  try {
    const response = await setItemSZ_CountInSiteNetworkRequest(id, num, price_id, source, is_sz, enddate, token, refreshToken);
    dispatch(setItemSZ_CountSiteSuccess());
  } catch(e) {
    dispatch(setItemSZ_CountSiteFailure());
  };
};

export const deleteItemSZ_Site = (cartId, token, refreshToken) => async (dispatch) => {
  dispatch(deleteItemSZ_SiteRequest());
  try {
    const response = await deleteCartSZ_SiteNetworkRequest(cartId, token, refreshToken);
    dispatch(deleteItemSZ_SiteSuccess());
  } catch(e) {
    dispatch(deleteItemSZ_SiteFailure());
  };
};

export const getCoopPriceProducts = (shopId, priceId, userId, page) => async (dispatch) => {
  dispatch(getPriceDetailRequest());
  try {
    const response = await getPriceDetailNetworkRequest(
      shopId,
      priceId,
      userId,
      page,
    );
    // const idProducts = response.data.id_products;
    // const numOrdersProducts = response.data.products.map(el => {
    //   if (el.num_orders) {
    //     return {
    //       id: el.id,
    //       numOrders: el.num_orders
    //     };
    //   }
    // });
    
    // dispatch(setNumOrdersProducts({ numOrdersProducts }));
    dispatch(addCoopPriceGroups({ groups: Object.values(response.data.groups) }));
    const res = response.data.products;
    // const product=res.map(el=>el.product);

    const product = res.map(el=> ({
      ...el.product,
      num_orders_sz: el.num_orders_sz,
      currency: el.currency,
    }));

    product.forEach(async product=> {
      dispatch(addProductToCoopPrice({ product}));
    });

    /*try {
      idProduct.forEach(async products => {
        const res = null //await getProductInfoNetworkRequest(product);
        dispatch(addProductToPrice({ product: res.product }));
      });
    } catch (e) {
      console.log(e);
    }*/
    dispatch(getPriceDetailSuccess());
  } catch (e) {
    dispatch(getPriceDetailFailure());
  }
};

export const setPriceGroups = groups => dispatch => {
  dispatch(addCoopPriceGroups({ groups: Object.values(groups) }))
};
