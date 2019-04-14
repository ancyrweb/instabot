/**
 * Middleware that allow to dispatch an array of actions, resulting in a single render
 * @param next
 * @returns {Function}
 */
export default function reduxBatchMiddleware(next: any) {
  let nextListeners: any = [];
  let currentListeners: any;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = nextListeners.slice();
    }
  }
  function subscribe(listener: any) {
    if (typeof listener !== "function")
      throw new Error("Invalid listener, expected a function");

    let isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) return;

      ensureCanMutateNextListeners();
      nextListeners.splice(nextListeners.indexOf(listener), 1);

      isSubscribed = false;
    };
  }
  function notifyListeners() {
    const listeners = nextListeners;

    for (let t = 0; t < listeners.length; ++t) {
      currentListeners = listeners;
      listeners[t]();
    }
  }

  return function nextStore(...args: any[]) {
    const store = next(...args);

    let receivedNotification = false;
    let inDispatch = false;

    function dispatchRecurse(action: any): any {
      return Array.isArray(action)
        ? action.map(subAction => dispatchRecurse(subAction))
        : store.dispatch(action);
    }

    function dispatch(action: any) {
      const reentrant = inDispatch;

      if (!reentrant) {
        receivedNotification = false;
        inDispatch = true;
      }

      const result = dispatchRecurse(action);
      const requiresNotification = receivedNotification && !reentrant;

      if (!reentrant) {
        receivedNotification = false;
        inDispatch = false;
      }

      if (requiresNotification) notifyListeners();

      return result;
    }

    store.subscribe(() => {
      if (inDispatch) {
        receivedNotification = true;
      } else {
        notifyListeners();
      }
    });

    return Object.assign({}, store, {
      dispatch,
      subscribe
    });
  };
}
