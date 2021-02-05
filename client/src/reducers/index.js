import loggedReducer from "./isLogged";
import { combineReducers } from "redux";

const allReducers = combineReducers({
  loggedReducer,
});

export default allReducers;
