import React from "react";
import { Route, Redirect } from "react-router-dom";
import AuthService from "./AuthService";

/**
 *
 * from: https://blog.netcetera.com/how-to-create-guarded-routes-for-your-react-app-d2fe7c7b6122
 */
const ProtectedRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props) =>
                AuthService.auth.isSignedIn === true ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    );
};

export default ProtectedRoute;
