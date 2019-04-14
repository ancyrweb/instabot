import { combineReducers, compose, createStore, Store } from "redux";
import arrayEnhancer from "./enhancer/array";
import resetStateEnhancer from "./enhancer/resetState";
import activity, {ActivityAction, ActivityState} from "./reducers/activity";
import history, { HistoryAction, HistoryState} from "./reducers/history";

export type AppState = {
  activity: ActivityState,
  history: HistoryState
};

export type AppActions = ActivityAction | HistoryAction | { type: "__RESET_STATE__", state: AppState };

const reducers = combineReducers({
  // @ts-ignore
  activity: activity.reducer,
  history: history.reducer,
});

const store : Store<AppState, AppActions> = createStore(
  reducers,
  compose(arrayEnhancer, resetStateEnhancer())
);

export const actions = {
  mergeActivity: activity.actions.merge,
  addHistory: history.actions.add,
};

export const setState = (state: AppState) => {
  store.dispatch({
    type: "__RESET_STATE__",
    state: state
  })
};

export default store;
