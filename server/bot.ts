import Variables from "./var/variables.json";

import Authenticator from "./src/bot/Authenticator";
import { Behavior } from "./src/bot/Behavior";
import { boolProb, rand, shuffle } from "./src/bot/helper/utils";
import WebNavigator from "./src/bot/WebNavigator";
import FindPosts, {FindPostOutcome, FindPostVariables} from "./src/bot/operation/FindPosts";
import ActOnPost, {ActOnPostOutcome, ActOnPostVariables} from "./src/bot/operation/ActOnPost";
import { Controller } from "./src/bot/Controller";
import store, {actions} from "./src/state/store";
import Looper from "./src/bot/Looper";

const run = async () => {
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
    },
    looper: new Looper(),
  });

  await controller.authenticate(Variables.authentication.username, Variables.authentication.password);
  controller.loop();

  process.on("message", (message) => {
    if (message.type === "action") {
      if (message.value === "stop") {
        controller.stop();
      }
    }
  });
};

run();
