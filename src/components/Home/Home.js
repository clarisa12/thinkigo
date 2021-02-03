import React, { useState } from "react";
import Dashboard from "../Dashboard/Dashboard";
import Login from "../Login/Login";

function Home() {
  const [isLogged, setisLogged] = useState(false);

  if (!isLogged) {
    return <Login />;
  }

  return <Dashboard />;
}

export default Home;
