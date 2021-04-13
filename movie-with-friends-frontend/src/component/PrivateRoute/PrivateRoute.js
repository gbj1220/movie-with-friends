import React from "react";
import { Route, Redirect } from "react-router-dom";
import { checkIfUserIsLoggedIn } from "../lib/helpers";

const PrivateRoute = ({ component: Component, handleUserLogout, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(routerProps) =>
        checkIfUserIsLoggedIn() ? (
          <Component {...routerProps} handleUserLogout={handleUserLogout} />
        ) : (
          <Redirect to='/login' />
        )
      }
    />
  );
};

export default PrivateRoute;

/* If there is a user render the Component + routerProps
    Else redirect the user to the sign-up page. */

/* ...rest is grabbing all of the properties from our MainRouter */
