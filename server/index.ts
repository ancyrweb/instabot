import * as childProcess from 'child_process';
import GraphQLServer from "./src/graphql/graphql";
import Config from "./config/config";
import {AppState} from "./src/state/store";

// @ts-ignore it's gonna be called directly when the bot will be initialized
let state : AppState = null;

// Fork the bot in a separate process so that the server and the bot can work concurrently
const bot = childProcess.fork('./bot.ts');
bot.on("message", (message) => {
  if (message.type) {
    if (message.type === "state") {
      state = (message.value as AppState);
    }
  }
});

// Launch the server
const server = new GraphQLServer({
  port: Config.webPort,
  authToken: Config.authToken,
  getState: () => state,
});

server
  .listen()
  .then(({ url }) => console.log("Server is running at " + url));
