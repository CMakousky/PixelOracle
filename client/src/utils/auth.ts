// Importing specific types and functions from the 'jwt-decode' library.
// JwtPayload: A type definition representing the structure of a JSON Web Token payload.
// jwtDecode: A function used to decode a JSON Web Token (JWT) and extract its payload.
import { type JwtPayload, jwtDecode } from 'jwt-decode';
import type { UserData } from '../interfaces/UserData';

class AuthService {
  getProfile() {
    // Decode the JSON Web Token (JWT) using the jwtDecode function, specifying the expected payload type as UserData.
    // The getToken() method is called to retrieve the JWT, which is then passed to jwtDecode to extract and return its payload.
    return jwtDecode<UserData>(this.getToken());
  }
  
  // Check if the user is logged in by retrieving the token from localStorage
  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token: string) {
    try {
      // Attempt to decode the provided token using jwtDecode, expecting a JwtPayload type.
      const decoded = jwtDecode<JwtPayload>(token);

      // Check if the decoded token has an 'exp' (expiration) property and if it is less than the current time in seconds.
      if (decoded?.exp && decoded?.exp < Date.now() / 1000) {
        // If the token is expired, return true indicating that it is expired.
        return true;
      }
    } catch (err) {
      // If decoding fails (e.g., due to an invalid token format), catch the error and return false.
      return false;
    }
  }

  // Function to extract the user_id from JWT
  extractID() {
    try {
      // Attempt to decode the provided token using jwtDecode, expecting a JwtPayload type.
      const token = this.getToken();
      const decoded = jwtDecode<JwtPayload>(token);
      return (decoded);
      } catch (err) {
      // If decoding fails (e.g., due to an invalid token format), catch the error and return false.
      console.log(err);
    }
  }
  
  // Retrieve the JWT token from localStorage
  getToken(): string {
    const loggedUser = localStorage.getItem('id_token') || '';
    return loggedUser;
  }

  // Store the JWT token in localStorage and redirect to the home page
  login(idToken: string) {
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  // Remove the JWT token from localStorage and redirect to the home page
  logout() {
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }

  selectUser = (): number => {
    const loggedIn = this.loggedIn();
    let user: number = 0;
    if (loggedIn) {
        const token: UserData = this.extractID() as UserData;
        user = token.id;
    } else {
        console.log("USER NOT LOGGED IN.");
    };
    return user;
  };

  getUserName = (): string => {
    const loggedIn = this.loggedIn();
    let userName: string ='';
    if (loggedIn) {
        const token: UserData = this.extractID() as UserData;
        userName = token.username;
    } else {
        console.log("USERNAME NOT FOUND!");
    };
    return userName;
  };
}

export default new AuthService();
