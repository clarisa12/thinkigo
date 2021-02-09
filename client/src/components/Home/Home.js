import React from "react";
import Dashboard from "../Dashboard/Dashboard";
import ProtectedRoute from "../../ProtectedRoute";
function Home() {
    return <ProtectedRoute component={Dashboard} />;
}

export default Home;
