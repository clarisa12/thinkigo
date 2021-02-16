import React from "react";
import { Route, Redirect } from "react-router-dom";
import AuthService from "./AuthService";

/**
 *
 * from: https://blog.netcetera.com/how-to-create-guarded-routes-for-your-react-app-d2fe7c7b6122
 */
const ProtectedRoute = ({ component: Component, ...rest }) => {
    const isSignedIn = AuthService.auth.isSignedIn === true;

    return (
        <Route
            {...rest}
            render={(props) =>
                isSignedIn ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={`/login?redirect=${window.location.pathname}`}
                    />
                )
            }
        />
    );
};

export default ProtectedRoute;
