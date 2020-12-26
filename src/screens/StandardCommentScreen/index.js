import { connect } from "react-redux";
import StandardCommentScreenComponent from "./StandardCommentScreen";
import { checkStandardComment, saveComment } from "./actions";

const mapStateToProps = state => ({
  standardComment:state.profile.standardComment,
});

const mapDispatchToProps = {
  checkStandardComment,
  saveComment,
};

export const StandardCommentScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(StandardCommentScreenComponent);
