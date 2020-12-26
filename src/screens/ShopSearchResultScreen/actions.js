import { createAction } from "redux-actions";

import {
  addProductToPrice,
  setNumOrdersProducts,
} from "../../actions";

import {
  getPriceDetailNetworkRequest,
} from "../../networkers";

export const getPriceDetailRequest = createAction("GET_PRICE_DETAIL_REQUEST");
export const getPriceDetailSuccess = createAction("GET_PRICE_DETAIL_SUCCESS");
export const getPriceDetailFailure = createAction("GET_PRICE_DETAIL_FAILURE");

export const getPriceProducts = (shopId, priceId, userId) => async (
  dispatch,
) => {
  dispatch(getPriceDetailRequest());
  try {
    const response = await getPriceDetailNetworkRequest(
      shopId,
      priceId,
      userId
    );
    const numOrdersProducts = response.data.products.map(el => {
      if (el.num_orders) {
        return {
          id: el.id,
          numOrders: el.num_orders
        };
      }
    });
    
    dispatch(setNumOrdersProducts({ numOrdersProducts }));

    const res = response.data.products;

    const product = res.map(el => ({
      ...el.product,
      num_orders_sz: el.num_orders_sz,
    }));

    product.forEach(async product => {
      dispatch(addProductToPrice({ product }));
    });

    dispatch(getPriceDetailSuccess());
  } catch (e) {
    dispatch(getPriceDetailFailure());
  };
};
