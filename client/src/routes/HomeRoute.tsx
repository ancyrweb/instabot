import React, { Component } from 'react';
import { Query } from "react-apollo";
import dayjs from "dayjs";
import GetActivity from "../graphql/queries/GetActivity";
import GetHistory from "../graphql/queries/GetHistory";

const historyToString = (history: any) => {
  switch (history.name) {
    case "scan-start": {
      return "Scanning last posts from " + history.payload.find((meta: any) => meta.name === "tag").value;
    }
    case "scan-end": {
      return "Scanning done";
    }
    case "act-start": {
      return "Scanning " + history.payload.find((meta: any) => meta.name === "url").value;
    }
    case "act-end": {
      const liked =  history.payload.find((meta: any) => meta.name === "liked").value === "yes";
      const followed =  history.payload.find((meta: any) => meta.name === "followed").value === "yes";
      let out;
      if (liked && followed) {
        out = "Liked and followed ";
      } else if (liked) {
        out = "Liked ";
      } else if (followed) {
        out = "Followed ";
      } else {
        out = "Did nothing ";
      }
      return out + " on " + history.payload.find((meta: any) => meta.name === "url").value;
    }
    case "pause-start": {
      return "Taking a pause for " + history.payload.find((meta: any) => meta.name === "for").value + " minutes";
    }
    case "pause-end": {
      return "End of pause";
    }
  }
};

class HomeRoute extends Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-lg-4">
            <div className="app-box">
              <h2 className="app-box__title">Stats</h2>
              <Query query={GetActivity} pollInterval={3000}>
                {({ loading, error, data } : any) => {
                  if (loading)
                    return <p>Loading...</p>;

                  if (error) {
                    return <p className="error">{ error.message }</p>
                  }

                  const elapsedTime = Math.floor((Date.now() - (new Date(data.activity.startedAt)).getTime()) / 1000);
                  const minutes = elapsedTime / 60;
                  const likesPerMinute = Math.round((data.activity.likes / minutes) * 100) / 100;

                  return (
                    <div className="app-box__body">
                      <div className="app-stats">
                        <div className="app-stats__row">
                          <h4 className="app-stats__title">{ data.activity.likes }</h4>
                          <p>Likes</p>
                        </div>
                        <div className="app-stats__row">
                          <h4 className="app-stats__title">{ data.activity.follows }</h4>
                          <p>Follows</p>
                        </div>
                      </div>
                      <div className="app-stats">
                        <div className="app-stats__row">
                          <h4 className="app-stats__title">{ likesPerMinute }</h4>
                          <p>Likes per minute</p>
                        </div>
                        <div className="app-stats__row">
                          <h4 className="app-stats__title">{ Math.floor(elapsedTime / 60) }<span style={{fontSize: "2rem"}}>mn</span></h4>
                          <p>Uptime</p>
                        </div>
                      </div>
                    </div>
                  )
                }}
              </Query>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="app-box">
              <h2 className="app-box__title">History</h2>
              <Query query={GetHistory} pollInterval={3000}>
                {({ loading, error, data } : any) => {
                  if (loading)
                    return <p>Loading...</p>;

                  if (error) {
                    return <p className="error">{ error.message }</p>
                  }


                  return (

                    <div className="app-box__body">
                      { data.history.slice().reverse().slice(0, 40).map((history: any, i: number) => (
                        <div key={i}>
                          <b>{ dayjs(history.date).format("DD/MM à HH:mm:ss")}</b> : { historyToString(history) }
                        </div>
                      ))}
                    </div>
                  )
                }}
              </Query>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HomeRoute;
