import React from "react";
import ReactDOM from "react-dom";
// CSS
import "./index.css";
import "./App.css";
import "./normalize.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";


// REDUX IMPORTS
import store from "./app/store";
import { Provider } from "react-redux";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
