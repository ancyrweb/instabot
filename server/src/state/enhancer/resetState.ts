/**
 * Enhancer to reset the state
 * @param option
 */
export default function resetMiddleware () {
  return (next: any) => (reducer: any, initialState: any, enhancer: any) => {
    let resetType : string = '__RESET_STATE__';

    const enhanceReducer = (state: any, action: { type: any, state: any }) => {
      if (action.type === resetType) {
        state = action.state;
      }
      return reducer(state, action);
    };

    return next(enhanceReducer, initialState, enhancer)
  }
}
