import React, { Component } from "react";
import { debounce } from "lodash";
import axios from "axios";
import { toast } from "react-toastify";
import "./SignUp.css";
import { checkIfUserIsLoggedIn } from "../lib/helpers";
import Axios from "../lib/axios/Axios";
/* checkIfUserIsLoggedIn is exporting a function from the file PrivateRoute. PrivateRoute is the default export. If it is not a default export you need to pull it in as an Object using {}  */

export class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      isError: false,
      errorObj: {},
    };

    this.onChangeDebounce = debounce(this.onChangeDebounce, 1000);
  }

  componentDidMount() {
    if (checkIfUserIsLoggedIn()) {
      this.props.history.push("/movie-home");
    } else {
      this.props.history.push("/sign-up");
    }
  }

  handleSignup = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  onChangeDebounce = () => {
    let errorObj = {};

    if (this.state.password !== this.state.confirmPassword) {
      errorObj.checkConfirmPassword = "Sorry, Your password does not match!";
    }

    // if (!isStrongPassword(this.state.password)) {
    //   errorObj.checkPasswordStrength =
    //     "Password must be 8 characters long + 1 uppercase + 1 lowercase + special characters !@#$%^&*()";
    // }

    if (Object.keys(errorObj).length > 0) {
      this.setState({
        isError: true,
        errorObj: errorObj,
      });
    } else {
      this.setState({
        isError: false,
        errorObj: {},
      });
    }
  };

  handleOnPasswordChange = (event) => {
    this.setState(
      {
        [event.target.name]: event.target.value,
      },
      () => {
        this.onChangeDebounce();
      }
    );
  };

  showErrorMessageObj = () => {
    let errorMessageArray = Object.values(this.state.errorObj);
    /* Mapping through to see if there are any objects && then displaying errors to user. */
    return errorMessageArray.map((errorMessage, index) => {
      return (
        <div key={index} className='alert alert-danger'>
          {errorMessage}
        </div>
      );
    });
  };

  handleOnSubmit = async (event) => {
    event.preventDefault();
    let { firstName, lastName, email, password, isError } = this.state;

    if (isError) {
      toast.error("Please fix your password!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      return;
    }
    try {
      let result = await Axios.post("http://localhost:3001/users/sign-up", {
        firstName,
        lastName,
        email,
        password,
      });

      this.setState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      toast.success("YAY! Please go login!!!!!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (e) {
      toast.error(e.response.data, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  render() {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      isError,
    } = this.state;
    return (
      <div className='form-body'>
        <main className='form-signin'>
          {isError && this.showErrorMessageObj()}

          <form onSubmit={this.handleOnSubmit}>
            <h1 className='h3 mb-3 fw-normal'>Please sign up</h1>
            <label htmlFor='inputFirstName' className='visually-hidden'>
              First Name
            </label>
            <input
              type='text'
              id='inputFirstName'
              className='form-control'
              placeholder='First Name'
              required
              autoFocus
              name='firstName'
              value={firstName}
              onChange={this.handleSignup}
              pattern='[A-Za-z]*'
            />
            <label htmlFor='inputLastName' className='visually-hidden'>
              Last Name
            </label>
            <input
              type='text'
              id='inputLastName'
              className='form-control'
              placeholder='Last Name'
              required
              autoFocus
              name='lastName'
              value={lastName}
              onChange={this.handleSignup}
              pattern='[A-Za-z]*'
            />
            <label htmlFor='inputEmail' className='visually-hidden'>
              Email address
            </label>
            <input
              type='email'
              id='inputEmail'
              className='form-control'
              placeholder='Email address'
              required
              autoFocus
              name='email'
              value={email}
              onChange={this.handleSignup}
            />
            <label htmlFor='inputPassword' className='visually-hidden'>
              Password
            </label>
            <input
              //type="password"
              type='text'
              id='inputPassword'
              className='form-control'
              placeholder='Password'
              required
              name='password'
              value={password}
              onChange={this.handleOnPasswordChange}
            />
            <label htmlFor='inputConfirmPassword' className='visually-hidden'>
              Confirm Password
            </label>
            <input
              //type="password"
              type='text'
              id='inputConfirmPassword'
              className='form-control'
              placeholder='Confirm Password'
              required
              name='confirmPassword'
              value={confirmPassword}
              onChange={this.handleOnPasswordChange}
            />
            <button
              className='w-100 btn btn-lg btn-primary'
              type='submit'
              disabled={isError ? true : false}
            >
              Sign up
            </button>
          </form>
        </main>
        ;
      </div>
    );
  }
}
export default SignUp;
