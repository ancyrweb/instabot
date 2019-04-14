export type HistoryMeta = {
  name: string
  value: string
}
export type History = {
  date: Date,
  name: string,
  payload: HistoryMeta[]
}
export type HistoryState = {
  values: History[]
}

export type HistoryAddAction = {
  type: "HISTORY_ADD",
  value: History
}

export type HistoryAction = HistoryAddAction;

const defaultState = {
  values: []
};

export default {
  reducer(state: HistoryState = defaultState, action: HistoryAction) {
    switch (action.type) {
      case "HISTORY_ADD":
        return {
          ...state,
          values: [
            ...state.values,
            action.value,
          ]
        }
    }

    return state;
  },
  actions: {
    add(value: History) : HistoryAddAction {
      return {
        type: "HISTORY_ADD",
        value,
      }
    }
  }
}
