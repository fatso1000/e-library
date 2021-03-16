import React from "react";
import { Route } from "react-router-dom";
import Home from "./components/home";
import Navbar from "./components/navbar";

function App() {
  return (
    <React.Fragment>
      <Navbar />
      <Route exact path="/" component={Home} />
    </React.Fragment>
  );
}

export default App;
