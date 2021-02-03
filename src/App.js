import "./App.css";
import { useState } from "react";
import Container from "./components/container/Container";
import Navigation from "./components/Navigation/Navigation";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Login/Register";
import Dashboard from "./components/Dashboard/Dashboard";

function App() {
  const [login, setLogin] = useState(false);

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/board" component={Container} />
          <Route path="/register" component={Register} />
          <Route path="/dashboard" component={Dashboard} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
