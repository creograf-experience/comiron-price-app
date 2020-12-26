import { createAction } from "redux-actions";

import {
  getShopProductInfoNetworkRequest,
} from "../../networkers";

export const getShopProductInfoRequest = createAction("GET_SHOP_PRODUCT_INFO_REQUEST");
export const getShopProductInfoSuccess = createAction("GET_SHOP_PRODUCT_INFO_SUCCESS");
export const getShopProductInfoFailure = createAction("GET_SHOP_PRODUCT_INFO_FAILURE");

export const addProductProps = createAction("ADD_PRODUCT_PROPS");

export const getShopProductInfo = productId => async (dispatch) => {
  dispatch(getShopProductInfoRequest());
  try {
    const response = await getShopProductInfoNetworkRequest(productId);
    const properties = response.product.props;
    dispatch(addProductProps({ properties }));
    dispatch(getShopProductInfoSuccess({ response }));
  } catch(e) {
    dispatch(getPriceDetailFailure());
  };
};