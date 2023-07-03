import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { combinedReducers } from './combinedReducer';

// export type AppState = ReturnType<typeof combinedReducers>;
// export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>;

export const configureStore = () => {
  const middleware = [thunkMiddleware];
  const middlewareEnhancer = composeWithDevTools(applyMiddleware(...middleware));
  const store = createStore(combinedReducers, {}, middlewareEnhancer);
  return store;
};
