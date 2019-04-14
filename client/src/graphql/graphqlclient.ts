import Config from "../config/config";
import ApolloClient from "apollo-boost";

const graphQLClient = new ApolloClient({
  uri: Config.url,
  request: async (operation) => {
    operation.setContext({
      headers: {
        authorization: "Bearer " + Config.authToken,
      }
    });
  }
});

export default graphQLClient;
