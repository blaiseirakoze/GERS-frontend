import { bindActionCreators } from "redux";
import {
  systemLogin,
  getLoggedUser
} from "../User/action";

export const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      SystemLogin: systemLogin,
      GetLoggedUser: getLoggedUser,
    },
    dispatch
  );
};
