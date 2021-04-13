import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import NotFound from "./component/NotFound/NotFound";
import Home from "./component/Home";
import Login from "./component/Login/Login";
import SignUp from "./component/SignUp/SignUp";
import AuthMovieHome from "./component/AuthMovieHome/AuthMovieHome";
import Navbar from "./component/Navbar/Navbar";
import PrivateRoute from "./component/PrivateRoute/PrivateRoute";
import MovieDetails from "./component/AuthMovieHome/MovieDetails";
import Profile from "./Profile/Profile";
import CreateFriend from "./component/CreateFriend/CreateFriend";

const MainRouter = (props) => {
  return (
    <Router>
      <Navbar user={props.user} handleUserLogout={props.handleUserLogout} />
      <Switch /* CANNOT use props in a Route. Have to pass down new routerProps using render method given to us by REACT. */
      >
        <PrivateRoute
          /*  PrivateRoute is used to make sure you cant just enter the page you want in the url and go to it. You must be verified before you can enter the page. */
          exact
          path='/movie-home'
          component={AuthMovieHome}
        />

        <PrivateRoute
          exact
          path='/profile'
          component={Profile}
          handleUserLogout={
            props.handleUserLogout
          } /* Handed down from App.js. */
        />

        <PrivateRoute exact path='/create-friend' component={CreateFriend} />

        <PrivateRoute
          exact
          path='/movie-details/:title'
          component={MovieDetails}
        />

        <Route exact path='/sign-up' component={SignUp} />

        <Route
          exact
          path='/login'
          render={(routerProps) => (
            <Login
              {...routerProps}
              /* Handed down from App.js. */
              handleUserLogin={props.handleUserLogin}
            /> /* Combining the props returned from the router and the handleUserLogin function. */
          )}
        />

        <Route exact path='/' component={Home} />
        <Route
          component={
            NotFound
          } /* This would be the default case in a regular switch statement. */
        />
      </Switch>
    </Router>
  );
};

export default MainRouter;
