import React, { Component } from "react";
import { debounce } from "lodash";
import axios from "axios";
import { toast } from "react-toastify";
import jwtDecode from "jwt-decode";

export class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isError: false,
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      errorObj: {},
      disabledSubmitButton: true,
    };
    this._isMounted = true;
    this.onChangeDebounce = debounce(this.onChangeDebounce, 1000);
  }

  handleOnSubmit = async (e) => {
    e.preventDefault();

    /* Grabbing the users token from localStorage. */
    let getJwtDecodedJwtToken = localStorage.getItem("jwtToken");

    /* Decoding the JWTToken we just received. */
    let decodedJwtToken = jwtDecode(getJwtDecodedJwtToken);

    /* Sending an axios request to update-user-password on the backend. */
    try {
      let success = await axios.put(
        "http://localhost:3001/users/update-user-password",
        {
          email: decodedJwtToken.email,
          oldPassword: this.state
            .oldPassword /* Setting the users email to the decoded token we received. */,
          newPassword: this.state
            .newPassword /* Setting the new password to the new password the user has provided. */,
        }
      );

      if (success.data.payload) {
        /* If there is data, handleUserLogout will send the user to the login page. */
        this.props.handleUserLogout();
        this.props.history.push("/login");
      }
    } catch (e) {
      console.log(e);
      toast.error(e.response.data, {
        /* Sending a toast-style error to the user if something goes wrong. Need to require in toast from react-toastify. */
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

  /* onChangeDebounce is going to wait 1 second after the user is done typing to throw and error if there is one. */
  onChangeDebounce = () => {
    let errorObj = {};
    /** Double checking the password the user wants to change to. */
    if (this.state.newPassword !== this.state.confirmNewPassword) {
      /** If the password don't match, errorObj will throw an error through checkConfirmPassword. */
      errorObj.checkConfirmPassword = "Sorry, Your password does not match!";
    }
    // if (!isStrongPassword(this.state.password)) {
    //   errorObj.checkPasswordStrength =
    //     "Password must be 8 characters long + 1 uppercase + 1 lowercase + special characters !@#$%^&*()";
    // }

    /* Checking the keys of the object to see if errorObj contains anything. If it does it's length will be more than 0 and trigger the error. */
    if (Object.keys(errorObj).length > 0) {
      this.setState({
        isError: true,
        errorObj: errorObj,
      });
    } else {
      /* Otherwise, continue on with a fresh state. */
      this.setState({
        isError: false,
        errorObj: {},
      });
    }
  };
  /* Parameters for edge cases on the Profile page. */
  handleOnPasswordChange = (event) => {
    this.setState(
      {
        /* Giving whatever was clicked on the value of what is inputted. */
        [event.target.name]: event.target.value,
      },
      () => {
        /* If the passwords match, enable the submit button. */
        if (this.state.newPassword === this.state.confirmNewPassword) {
          this.setState({
            disabledSubmitButton: false,
          });
        } else {
          /* If the passwords don't match, disable the button component.*/
          this.setState({
            disabledSubmitButton: true,
          });
        }
        /* If the component isn't mounted, don't run onChangeDebounce and vice versa. */
        if (this._isMounted) {
          this.onChangeDebounce();
        }
      }
    );
  };

  showErrorMessageObj = () => {
    let errorMessageArray = Object.values(this.state.errorObj);
    return errorMessageArray.map((errorMessage, index) => {
      return (
        <div key={index} className='alert alert-danger'>
          {errorMessage}
        </div>
      );
    });
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleOldPasswordChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    const {
      oldPassword,
      confirmNewPassword,
      newPassword,
      isError,
    } = this.state;

    return (
      <div className='form-body'>
        <main className='form-signin'>
          {isError && this.showErrorMessageObj()}
          <form onSubmit={this.handleOnSubmit}>
            <h1 className='h3 mb-3 fw-normal'>Change your password</h1>

            <label htmlFor='oldPassword' className='visually-hidden'>
              Old Password
            </label>

            <input
              //type="password"
              type='text'
              id='oldPassword'
              className='form-control'
              placeholder='Old Password'
              required
              name='oldPassword'
              value={oldPassword}
              onChange={this.handleOldPasswordChange}
            />

            <br />

            <label htmlFor='newPassword' className='visually-hidden'>
              New Password
            </label>
            <input
              //type="password"
              type='text'
              id='inputPassword'
              className='form-control'
              placeholder='New Password'
              required
              name='newPassword'
              value={newPassword}
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
              placeholder='Confirm New Password'
              required
              name='confirmNewPassword'
              value={confirmNewPassword}
              onChange={this.handleOnPasswordChange}
            />
            <button
              className='w-100 btn btn-lg btn-primary'
              type='submit'
              disabled={this.state.disabledSubmitButton}
            >
              Change Password
            </button>
          </form>
        </main>
      </div>
    );
  }
}
export default Profile;
