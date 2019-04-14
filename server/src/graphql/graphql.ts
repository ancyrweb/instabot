import { ApolloServer, gql, AuthenticationError } from "apollo-server";
import { GraphQLDateTime } from "graphql-iso-date";
import {AppState} from "../state/store";

class GraphQLServer {
  private port : number;
  private getState : () => AppState;
  private server : ApolloServer;
  private authToken : string;

  constructor(config: {
    port: number,
    getState: () => AppState,
    authToken: string
  }) {
    this.port = config.port;
    this.getState = config.getState;
    this.authToken = config.authToken;

    this.server = new ApolloServer({
      typeDefs: gql`
          scalar DateTime
          
          type Activity {
              likes: Int!
              follows: Int!
              startedAt: DateTime!
          }
          type HistoryMeta {
              name: String!
              value: String!
          }
          type History {
              date: DateTime!
              name: String!
              payload: [HistoryMeta!]!
          }

          type Query {
              activity: Activity
              history: [History!]!
          }
      `,
      resolvers: {
        Query: {
          activity: () => this.getState().activity,
          history: () => this.getState().history.values,
        },
        DateTime: GraphQLDateTime
      },
      context: ({ req }) => {
        // @ts-ignore
        const token = req.headers.authorization || "";
        if (token !== "Bearer " + this.authToken) {
          throw new AuthenticationError('You must be logged in');
        }
      },
    });

  }

  listen() {
    return this.server.listen();
  }
}

export default GraphQLServer;
