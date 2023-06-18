/**
 * Create
 * @param state
 */

export const mapStateToProps = (state) => {
  return {
    // user
    loggedUser: state.user.loggedUser,
    errorMessage: state.user.errorMessage,
  };
};