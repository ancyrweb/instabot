import LooperInterface from "./interfaces/LooperInterface";
import {boolProb, rand, shuffle} from "./helper/utils";
import Variables from "../../var/variables.json";
import store, {actions} from "../state/store";
import {FindPostOutcome, FindPostVariables} from "./operation/FindPosts";
import {ActOnPostOutcome, ActOnPostVariables} from "./operation/ActOnPost";
import {Operator} from "./Controller";
import History from "../state/history";

let numbers = [72, 48, 72, 120, 72, 48, 36, 96];

class Looper implements LooperInterface {
  async run(operator: Operator) {
    if (operator.isStopped())
      return;

    // Splitted into 2 functions for easier testing
    return this.doWork(operator);
  }

  async doWork(operator: Operator) {
    let tags = shuffle(Variables.actions.tags);
    for (let tag of tags) {
      // Fetch an amount of URL for each tag,
      // each url will then be scanned and an action be performed on them
      const amount = numbers[rand(0, numbers.length - 1)];
      History.onScanStart(tag, amount);

      const posts = await operator.dispatch<FindPostVariables, FindPostOutcome>("findPosts", { tag, amount });
      History.onScanEnd(posts);

      for (let post of posts) {
        if (operator.shouldTakePause()) {
          History.onPauseStart(operator.nextPauseDuration().toString());
          await operator.takePause();
          History.onPauseEnd();
        }

        History.onActStart(post);
        const result = await operator.dispatch<ActOnPostVariables, ActOnPostOutcome>("actOnPost", {
          // @ts-ignore
          like: boolProb(Variables.actions.likeRate),
          // @ts-ignore
          follow: boolProb(Variables.actions.followRate),
          url: post,
        });

        let liked = false, followed = false;
        if (typeof result === "object" && result !== null) {
          liked = result.liked;
          followed = result.followed;
        }

        History.onActEnd(post, liked, followed);
        store.dispatch(actions.mergeActivity({
          follows: store.getState().activity.follows + (followed ? 1 : 0),
          likes: store.getState().activity.likes + (liked ? 1 : 0),
        }));
      }
    }

  }
}

export default Looper;
