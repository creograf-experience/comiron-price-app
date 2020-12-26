import { createAction } from "redux-actions";
import { setAllOrders, renewAllOrders } from "../../actions";
import { getAllOrderNetworkRequest } from "../../networkers";

export const getAllOrderRequest= createAction("GET_ALL_ORDER_REQUEST");
export const getAllOrderSuccess = createAction("GET_ALL_ORDER_SUCCESS");
export const getAllOrderFailure = createAction("GET_ALL_ORDER_FAILURE");

export const getPricesRequest = createAction("GET_PRICES_REQUEST");
export const getPricesSuccess = createAction("GET_PRICES_SUCCESS");
export const getPricesFailure = createAction("GET_PRICES_FAILURE");

export const getAllOrder = (token, refreshToken, page) => async (dispatch) => {
  dispatch(getAllOrderRequest());
  try {
    const response = await getAllOrderNetworkRequest(token, refreshToken, page);
    const orders = response.orders;
    if (response.orders) {
      dispatch(setAllOrders({ orders }));
    }
    dispatch(getAllOrderSuccess());
  } catch(e) {
    dispatch(getPricesFailure());
  }
};

export const renewGetAllOrder = (token, refreshToken, page) => async(dispatch) => {
  dispatch(getAllOrderRequest());
  try {
    const response = await getAllOrderNetworkRequest(token, refreshToken, page);
    const orders = response.orders;
    if (response.orders) {
      dispatch(renewAllOrders({ orders }));
    }
    dispatch(getAllOrderSuccess());
  } catch(e) {
    dispatch(getPricesFailure());
  }
};


