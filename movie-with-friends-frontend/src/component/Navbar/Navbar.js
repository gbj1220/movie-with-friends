import React from "react";
import { NavLink, Link } from "react-router-dom";

import "./Navbar.css";

function Navbar(props) {
  return (
    <header className='d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-body border-bottom shadow-sm'>
      <p className='h5 my-0 me-md-auto fw-normal'>
        <Link to='movie-home'>
          <i className='fas fa-film'></i>
        </Link>
      </p>
      <nav className='my-2 my-md-0 me-md-3'>
        <NavLink
          exact
          className='p-2'
          // activeStyle={{ color: "red" }}
          activeClassName='active-class-style'
          to={props.user ? "/movie-home" : "/home"}
        >
          {props.user ? "Movie Search" : "Home"}
        </NavLink>
      </nav>
      {props.user ? (
        <>
          <NavLink
            className='btn btn-outline-light'
            activeStyle={{ color: "yellow" }}
            style={{
              backgroundColor: "salmon",
              color: "white",
              fontWeight: "bold",
              borderStyle: "solid",
              borderWidth: "2px",
              borderColor: "salmon",
            }}
            to='create-friend'
          >
            Create Friend
          </NavLink>

          <NavLink
            className='btn btn-outline-light'
            activeStyle={{ color: "yellow" }}
            style={{
              backgroundColor: "salmon",
              color: "white",
              fontWeight: "bold",
              borderStyle: "solid",
              borderWidth: "2px",
              borderColor: "salmon",
            }}
            to='/profile'
          >
            {props.user.email}
          </NavLink>
          <Link
            className='btn btn-outline-light'
            to='/login'
            onClick={props.handleUserLogout}
            style={{
              backgroundColor: "salmon",
              color: "white",
              fontWeight: "bold",
              borderStyle: "solid",
              borderWidth: "2px",
              borderColor: "salmon",
            }}
          >
            Logout
          </Link>
        </>
      ) : (
        <>
          <NavLink
            className='btn btn-outline-primary'
            activeStyle={{ color: "yellow" }}
            to='/sign-up'
          >
            Sign up
          </NavLink>
          <NavLink
            className='btn btn-outline-primary'
            activeStyle={{ color: "yellow" }}
            to='/login'
          >
            Login
          </NavLink>
        </>
      )}
    </header>
  );
}

export default Navbar;
