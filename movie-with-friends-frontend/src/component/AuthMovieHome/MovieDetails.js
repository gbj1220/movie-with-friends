import React, { Component } from "react";
import axios from "axios";
import Axios from "../lib/axios/Axios";

export class MovieDetails extends Component {
  state = {
    movieInfo: null,
    friendsArray: [],
    selectFriend: "",
  };

  handleSelectFriend = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  componentDidMount = async () => {
    try {
      /* Waiting to get the data for whatever movie the user clicked on */
      const payload = await Axios.get(
        `http://omdbapi.com/?apikey=e739e00a&t=${this.props.match.params.title}&plot=full`
      );

      /* Grabbing the users token */
      const jwtToken = localStorage.getItem("jwtToken");

      const friendsArrayPayload = await axios.get(
        "http://localhost:3001/friends/get-all-friends",
        {
          headers: {
            authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      this.setState({
        movieInfo: payload.data,
        friendsArray: friendsArrayPayload.data.friends,
      });
    } catch (e) {
      console.log(e);
    }
  };

  handleSendToFriend = async () => {
    console.log(this.state.selectFriend);

    const selectedFriendInfo = this.state.friendsArray.filter(
      (item) => item._id === this.state.selectFriend
    );
    const { Title, Plot, imdbID } = this.state.movieInfo;
    console.log(this.state.movieInfo);

    const movieTextInfo = {
      title: Title,
      plot: Plot,
      imdbID: imdbID,
      targetUser: selectedFriendInfo[0],
    };

    const jwtToken = localStorage.getItem("jwtToken");

    try {
      const payload = await Axios.post(
        "http://localhost:3001/users/send-sms-movie-to-friend",
        movieTextInfo,
        {
          headers: {
            authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      console.log(payload);
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <>
        {this.state.movieInfo ? (
          <div className='container'>
            <div className='row'>
              <div className='col-md-6'>
                <img src={this.state.movieInfo.Poster} alt='something' />
              </div>
              <div className='col-md-6'>
                <h1>{this.state.movieInfo.Title}</h1>
                <p>{this.state.movieInfo.Plot}</p>
                {this.state.movieInfo.Ratings.map((item) => {
                  return (
                    <div key={item.Source}>
                      {item.Source}: {item.Value}
                    </div>
                  );
                })}
                <div>
                  <a
                    className='btn btn-primary'
                    target='_blank'
                    href={`https://www.imdb.com/title/${this.state.movieInfo.imdbID}/`}
                  >
                    IMDB Link
                  </a>
                  <span style={{ marginLeft: 15 }}>
                    <label>Please choose a friend</label>
                    <select
                      value={this.state.selectFriend}
                      style={{ marginLeft: 15 }}
                      onChange={this.handleSelectFriend}
                      name='selectFriend'
                    >
                      <option>Select a Friend</option>

                      {this.state.friendsArray.map((item) => {
                        return (
                          <option key={item._id} value={item._id}>
                            {item.nickName}
                          </option>
                        );
                      })}
                    </select>
                    <div style={{ textAlign: "center" }}>
                      <button
                        onClick={this.handleSendToFriend}
                        className='btn btn-success'
                      >
                        Send to friend
                      </button>
                    </div>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>...Loading</div>
        )}
      </>
    );
  }
}

export default MovieDetails;
