import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Axios from "../lib/axios/Axios";
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

/* Setting the initial state. */
export class AuthMovieHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      movieInput: "",
      movieArray: [],
      isLoading: false,
      isError: false,
      errorMessage: "",
    };
  }
  /* First thing that will show up on the webpage. Using a random function to pick random movies out of the array. */
  async componentDidMount() {
    let randomTitle = ["batman", "superman", "lego", "alien", "predator"];
    let randomSelectedTitle = Math.floor(Math.random() * randomTitle.length);
    this.setState({
      /* Setting isLoading property to true so that the user gets a message saying Loading... while they wait for their results to come back. */
      isLoading: true,
    });
    try {
      /* Making an axios call to grab the random movies from the server and display them to the user upon initial viewing.  */
      let movieData = await Axios.get(
        `http://omdbapi.com/?apikey=e739e00a&s=${randomTitle[randomSelectedTitle]}`,
        {
          /* Declaring a variable to hold source.token. Holding a promise to cancel whatever it is called upon. */
          cancelToken: source.token,
        }
      );
      /* Setting movieArray's value to whatever the user searches for. Also resets the movieInput box to be empty after user hits enter. */
      this.setState({
        movieArray: movieData.data.Search,
        isLoading: false,
        movieInput: "",
      });
    } catch (e) {
      console.log(e);
    }
  }

  /* Grabbing whatever is entered into the input box on the HOME page. */
  handleMovieInput = (event) => {
    this.setState({
      movieInput: event.target.value,
      isError: false,
      errorMessage: "",
    });
  };

  componentWillUnmount() {
    /* If the page is still loading and hasn't completed its axios call, cancel that call. */
    if (this.state.isLoading) {
      source.cancel("Operation cancelled by the user.");
    }
  }

  handleSearchMovieClick = async (event) => {
    if (this.state.movieInput.length === 0) {
      this.setState({
        isError: true,
        errorMessage: "Sorry, please enter a movie title",
        movieInput: "",
      });
      return;
    }
    this.setState({
      isLoading: true,
    });
    try {
      let movieData = await Axios.get(
        `http://omdbapi.com/?apikey=e739e00a&s=${this.state.movieInput}`
      );

      /* The .data.?.Response is checking if there is any data pertaining to what the user searched for. If there is not it throws an error telling the user there is nothing there. Without this the app would break. */
      if (movieData.data?.Response === "False") {
        this.setState({
          isLoading: false,
          isError: true,
          errorMessage:
            "Sorry, No such movie exists. Please search another one",
        });
        return;
      }

      /* If the above statement is false, setState to have movieArray values === whatever the user searches for. */
      this.setState({
        movieArray: movieData.data.Search,
        isLoading: false,
        movieInput: "",
      });
    } catch (e) {
      console.log(e);
    }
  };

  /* If the user hits send without typing in a movie, they will get an error message. */
  handleSearchOnEnter = async (event) => {
    if (this.state.movieInput.length === 0) {
      this.setState({
        isError: true,
        errorMessage: "Sorry, please enter a movie title",
      });
      return;
    }
    /* If the ENTER key is pressed, isLoading will be set to true until the data comes back for the user. */
    if (event.key === "Enter") {
      this.setState({
        isLoading: true,
      });
      try {
        let movieData = await Axios.get(
          `http://omdbapi.com/?apikey=e739e00a&s=${this.state.movieInput}`
        );
        /* If the movie entered is not valid and there is no data, send the user an error message. Otherwise the app will break. */
        if (movieData.data?.Response === "False") {
          this.setState({
            isLoading: false,
            isError: true,
            errorMessage:
              "Sorry, No such movie exists. Please search another one",
          });
          return;
        }
        /* Setting the state so that our movieArray's value is that of whatever was searched for. */
        this.setState({
          movieArray: movieData.data.Search,
          isLoading: false,
          movieInput: "",
        });
      } catch (e) {
        console.log(e);
      }
    }
  };
  /* Function to show all of the data (movies) we get back from the server so that we can build out the webpage with JSX to include the new data. */
  showMovieArrayList = () => {
    return this.state.movieArray.map((item) => {
      return (
        <div className='col-sm-4' key={item.imdbID}>
          <div className='card'>
            <div>
              <img
                className='card-img-top'
                src={item.Poster}
                alt={item.Title}
                style={{ width: 250, height: 250 }}
              />
            </div>
            <Link
              to={{
                pathname: `/movie-details/${item.Title}`,
              }}
            >
              <h5 className='card-title'>{item.Title}</h5>
            </Link>
          </div>
        </div>
      );
    });
  };
  render() {
    return (
      <div style={{ marginTop: 50, textAlign: "center" }}>
        <input
          style={{ width: 450, borderColor: "salmon" }}
          name='movieInput'
          value={this.state.movieInput}
          onChange={this.handleMovieInput}
          onKeyPress={this.handleSearchOnEnter}
        />
        <br />
        <button
          onClick={this.handleSearchMovieClick}
          style={{
            margin: "25px 25px",
            color: "white",
            backgroundColor: "salmon",
          }}
          className='btn btn-light'
        >
          Search
        </button>
        <div>
          {this.state.isError && (
            <span style={{ color: "red" }}>{this.state.errorMessage}</span>
          )}
        </div>
        {this.state.isLoading ? (
          <div>...Loading</div>
        ) : (
          <div className='row'>{this.showMovieArrayList()}</div>
        )}
      </div>
    );
  }
}
export default AuthMovieHome;
