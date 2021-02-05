import React from "react";
import Dashboard from "../Dashboard/Dashboard";
import Login from "../Login/Login";
import { useSelector } from "react-redux";

function Home() {
  const isLogged = useSelector((state) => state.loggedReducer);

  if (!isLogged) {
    return <Login />;
  }

  return (
    <div>
      <Dashboard />
    </div>
  );
}

export default Home;
