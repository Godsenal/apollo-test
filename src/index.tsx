import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import { Grommet } from "grommet";
import { grommet } from "grommet/themes";
import "./index.css";
import App from "./App";
import client from "./apollo";
import * as serviceWorker from "./serviceWorker";
import userAgent from "./utils/userAgent";

client.writeData({
  data: {
    device: {
      __typename: "Device",
      ...userAgent.getDevice()
    }
  }
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Grommet theme={grommet}>
      <App />
    </Grommet>
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
