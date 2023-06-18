

export const dispatchHandler = ({ type, data, dispatch }) => {
  dispatch({
    type,
    payload: data,
  });
};

