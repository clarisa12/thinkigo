import "./App.css";
import Container from "./components/Container/Container";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Register from "./components/Login/Register";
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
