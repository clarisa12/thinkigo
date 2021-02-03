import "./App.css";
import { useState } from "react";
import Container from "./components/container/Container";
import Navigation from "./components/Navigation/Navigation";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Login/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import Home from "./components/Home/Home";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/board" component={Container} />
          <Route path="/register" component={Register} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
