import { createAction } from "redux-actions";
import { checkProfileNetworkRequest,saveStandardCommentRequest } from "../../networkers";

export const checkStandardCommentRequest = createAction("CHECK_STANDARD_COMMENT_REQUSET");
export const checkStandardCommentSuccess= createAction("CHECK_STANDARD_COMMENT_SUCCESS");
export const checkStandardCommentFailure= createAction("CHECK_STANDARD_COMMENT_FAILURE");

export const saveCommentRequest = createAction("SAVE_COMMENT_REQUEST");
export const saveCommentSuccess = createAction("SAVE_COMMENT_SUCCESS");
export const saveCommentFailure = createAction("SAVE_COMMENT_FAILURE");

export const checkStandardComment = (token, refreshToken) => async (dispatch) => {
  dispatch(checkStandardCommentRequest());
  try {
    const res = await checkProfileNetworkRequest(token, refreshToken);
    const standardComment = res.person.standartcomments;
    dispatch(checkStandardCommentSuccess({ standardComment }));
  }
  catch(error) {
    dispatch(checkStandardCommentFailure({ error }));
  };
};

export const saveComment = (standardComment) => async(dispatch) => {
  dispatch(saveCommentRequest());
  try {
    const response = await saveStandardCommentRequest(standardComment);
    dispatch(saveCommentSuccess());
  } catch(e) {
    dispatch(saveCommentFailure());
  };
};