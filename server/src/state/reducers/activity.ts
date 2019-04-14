import { OrNull } from "../../types";

export type ActivityState = {
  likes: number,
  follows: number,
  startedAt: OrNull<Date>,
}

export type ActivityMergeAction = {
  type: "ACTIVITY_MERGE",
  value: Partial<ActivityState>
}

export type ActivityAction = ActivityMergeAction;

const defaultState = {
  likes: 0,
  follows: 0,
  startedAt: null
};

export default {
  reducer(state: ActivityState = defaultState, action: ActivityAction) {
    switch (action.type) {
      case "ACTIVITY_MERGE":
        return {
          ...state,
          ...action.value,
        }
    }

    return state;
  },
  actions: {
    merge(value: Partial<ActivityState>) : ActivityMergeAction {
      return {
        type: "ACTIVITY_MERGE",
        value,
      }
    }
  }
}
