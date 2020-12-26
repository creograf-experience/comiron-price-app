import { createAction } from "redux-actions";
import { getUserPhone } from "../../utils";

export const savePhoneSuccess = createAction("SAVE_PHONE_SUCCESS");
export const saveCommentSuccess = createAction("SAVE_COMMENT_SUCCESS");

export const savePhone = () => async (dispatch) => {
  const phone = await getUserPhone();
  dispatch(savePhoneSuccess({ phone }));
};

export const saveComment = comment => dispatch => {
  dispatch(saveCommentSuccess({ comment }));
};
