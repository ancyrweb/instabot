import store, {actions} from "./store";

const History = {
  onScanStart(tag: string, amount: number) {
    store.dispatch(actions.addHistory({
      date: new Date(),
      name: "scan-start",
      payload: [
        { name: "tag", value: tag },
        { name: "amount", value: amount.toString() },
      ]
    }));
  },
  onScanEnd(posts: string[]) {
    store.dispatch(actions.addHistory({
      date: new Date(),
      name: "scan-end",
      payload: [
        { name: "urls", value: JSON.stringify(posts) }
      ]
    }));
  },
  onPauseStart(duration: string) {
    store.dispatch(actions.addHistory({
      date: new Date(),
      name: "pause-start",
      payload: [
        { name: "for", value: duration }
      ]
    }));
  },
  onPauseEnd() {
    store.dispatch(actions.addHistory({
      date: new Date(),
      name: "pause-end",
      payload: [],
    }));
  },
  onActStart(post: string) {
    store.dispatch(actions.addHistory({
      date: new Date(),
      name: "act-start",
      payload: [
        { name: "url", value: post }
      ]
    }));
  },
  onActEnd(post: string, liked: boolean, followed: boolean) {
    store.dispatch(actions.addHistory({
      date: new Date(),
      name: "act-end",
      payload: [
        { name: "url", value: post },
        { name: "liked", value : liked ? "yes" : "no" },
        { name: "followed", value : followed ? "yes" : "no" }
      ]
    }))
  }
};

export default History;
