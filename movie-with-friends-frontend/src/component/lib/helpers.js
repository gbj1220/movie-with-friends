import jwtDecode from "jwt-decode";

export function checkIfUserIsLoggedIn() {
  let getJwtToken = localStorage.getItem("jwtToken");

  if (getJwtToken) {
    const currentTime = Date.now() / 1000;

    let decodedJwtToken = jwtDecode(getJwtToken);

    if (decodedJwtToken.exp < currentTime) {
      localStorage.removeItem("jwtToken");
      return false;
    } else {
      return true;
    }
  }
}
