import React from "react";
import "./translations/i18n"
import ReactDOM from "react-dom";
import {Provider} from "mobx-react";
import store from "./stores";
import App from "./components/App";
import Firebase, {FirebaseContext} from "./components/Firebase";
import {enableLogging} from "mobx-logger";

enableLogging();
store.firebase = new Firebase();


ReactDOM.render(
  <FirebaseContext.Provider value={store.firebase}>
    <Provider {...store}>
      <App/>
    </Provider>
  </FirebaseContext.Provider>,
  document.getElementById("root")
);

