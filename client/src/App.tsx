import React, { Component } from 'react';
import { ApolloProvider } from "react-apollo";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import graphQLClient from "./graphql/graphqlclient";
import HomeRoute from "./routes/HomeRoute";
import SettingsRoute from "./routes/SettingsRoute";

class App extends Component {
  render() {
    return (
      <ApolloProvider client={graphQLClient}>
        <Router>
          <div className="header">
            <h1 className="header__title">Instabot</h1>
          </div>
          <div className="body">
            <div className="menu">
              <ul>
                <li>
                  <Link to={"/"}>Home</Link>
                </li>
                <li>
                  <Link to={"/settings"}>Settings</Link>
                </li>
              </ul>
            </div>
            <div className="content">
              <div>
                <Route path={"/"} component={HomeRoute} exact />
                <Route path={"/settings"} component={SettingsRoute} />
              </div>
            </div>
          </div>
        </Router>
      </ApolloProvider>
  );
  }
  }

  export default App;
