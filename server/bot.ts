import Variables from "./var/variables.json";

import Authenticator from "./src/bot/Authenticator";
import { Behavior } from "./src/bot/Behavior";
import { boolProb, rand, shuffle } from "./src/bot/helper/utils";
import WebNavigator from "./src/bot/WebNavigator";
import FindPosts, {FindPostOutcome, FindPostVariables} from "./src/bot/operation/FindPosts";
import ActOnPost, {ActOnPostOutcome, ActOnPostVariables} from "./src/bot/operation/ActOnPost";
import { Controller } from "./src/bot/Controller";
import store, {actions} from "./src/state/store";

const run = async () => {
  let numbers = [72, 48, 72, 120, 72, 48, 36, 96];
  store.subscribe(() => {
    // @ts-ignore
    process.send({ type: "state", value: store.getState() });
  });

  store.dispatch(actions.mergeActivity({
    startedAt: new Date()
  }));

  const navigator = new WebNavigator({
    headless: Variables.engine.headless,
    userAgent: Variables.engine.userAgent,
  });

  const controller = new Controller({
    navigator,
    behavior: new Behavior({
      minimumWorkingTime: 30,
      maximumWorkingTime: 45,
      shortPauseMinimumTime: 2,
      shortPauseMaximumTime: 8,
      longPauseMinimumTime: 5,
      longPauseMaximumTime: 20
    }),
    authenticator: new Authenticator(navigator),
    operations: {
      findPosts: new FindPosts(navigator),
      actOnPost: new ActOnPost(navigator)
    }
  });

  await controller.authenticate(Variables.authentication.username, Variables.authentication.password);
  controller.loop(async (operator) => {
    let tags = shuffle(Variables.actions.tags);
    for (let tag of tags) {
      // Fetch an amount of URL for each tag,
      // each url will then be scanned and an action be performed on them
      const amount = numbers[rand(0, numbers.length - 1)];
      store.dispatch(actions.addHistory({
        date: new Date(),
        name: "scan-start",
        payload: [
          { name: "tag", value: tag },
          { name: "amount", value: amount.toString() },
        ]
      }));

      const posts = await operator.dispatch<FindPostVariables, FindPostOutcome>("findPosts", { tag, amount });
      store.dispatch(actions.addHistory({
        date: new Date(),
        name: "scan-end",
        payload: [
          { name: "urls", value: JSON.stringify(posts) }
        ]
      }));

      for (let post of posts) {
        if (operator.shouldTakePause()) {
          store.dispatch(actions.addHistory({
            date: new Date(),
            name: "pause-start",
            payload: [
              { name: "for", value: operator.nextPauseDuration().toString() }
            ]
          }));
          await operator.takePause();
          store.dispatch(actions.addHistory({
            date: new Date(),
            name: "pause-end",
            payload: [],
          }));
        }

        store.dispatch(actions.addHistory({
          date: new Date(),
          name: "act-start",
          payload: [
            { name: "url", value: post }
          ]
        }));
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

        store.dispatch(actions.addHistory({
          date: new Date(),
          name: "act-end",
          payload: [
            { name: "url", value: post },
            { name: "liked", value : liked ? "yes" : "no" },
            { name: "followed", value : followed ? "yes" : "no" }
          ]
        }));
        store.dispatch(actions.mergeActivity({
          follows: store.getState().activity.follows + (followed ? 1 : 0),
          likes: store.getState().activity.likes + (liked ? 1 : 0),
        }));
      }
    }
  });
};

run();
