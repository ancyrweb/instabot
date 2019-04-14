import { combineReducers, compose, createStore, Store } from "redux";
import reduxBatchMiddleware from "./enhancer/array";
import activity, {ActivityAction, ActivityState} from "./reducers/activity";
import history, { HistoryAction, HistoryState} from "./reducers/history";

export type AppState = {
  activity: ActivityState,
  history: HistoryState
};

export type AppActions = ActivityAction | HistoryAction;

const reducers = combineReducers({
  // @ts-ignore
  activity: activity.reducer,
  history: history.reducer,
});

const store : Store<AppState, AppActions> = createStore(
  reducers,
  compose(reduxBatchMiddleware)
);

export const actions = {
  mergeActivity: activity.actions.merge,
  addHistory: history.actions.add,
};

export default store;
