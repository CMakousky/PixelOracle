import { useState, FormEvent, ChangeEvent } from "react";
import Auth from '../utils/auth';
import { login, newUser } from '../api/authAPI';
import type { UserLogin } from '../interfaces/UserLogin';
import type { RegisterUser } from "../interfaces/RegisterUser";

// import bcrypt from "bcryptjs";
// import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  // const [username, setUsername] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [token, setToken] = useState<string | null>(null);
  // const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);

  const [loginData, setLoginData] = useState<UserLogin>({
    username: '',
    password: '',
  });

  const [registrationData, setRegistrationData] = useState<RegisterUser>({
    username: '',
    email: '',
    password: '',
  });

  // Handle changes in the LOGIN input fields
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  // Handle changes in the REGISTRATION input fields
  const handleChangeR = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRegistrationData({
      ...registrationData,
      [name]: value,
    });
  };

  // Handle form submission for login
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // Call the login API endpoint with loginData
      const data = await login(loginData);
      // If login is successful, call Auth.login to store the token in localStorage
      Auth.login(data.token);
    } catch (err) {
      console.error('Failed to login', err);
    }
  };

  // Handle form submission for registration
  const handleSubmitRegistration = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (registrationData.username.length > 0 && registrationData.email.length > 0 && registrationData.password.length > 0) {
        await newUser(registrationData);
        setIsRegistering(false);
      } else {console.log('REGISTRATION FAILED! Please complete all fields.')};
    } catch (err) {
      console.error('Failed to Register.', err);
    }
  };

  // const [loginData, setLoginData] = useState<UserLogin>({} as UserLogin);
  // const navigate = useNavigate();

  // const handleRegister = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError("");
  //   setIsLoading(true);

  //   try {
  //     const existingUser = localStorage.getItem(`user_${username}`);
  //     if (existingUser) {
  //       setError("User already exists. Please log in.");
  //       setIsLoading(false);
  //       return;
  //     }

  //     const hashedPassword = await bcrypt.hash(password, 10);
  //     const userData = JSON.stringify({ username, email, password: hashedPassword });
  //     localStorage.setItem(`user_${username}`, userData);

  //     alert("Registration successful! Please log in.");
  //     setIsRegistering(false);
  //   } catch (err) {
  //     console.error(err);
  //     setError("Registration failed. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError("");
  //   setIsLoading(true);

  //   try {
  //     const storedUser = localStorage.getItem(`user_${username}`);
  //     if (!storedUser) {
  //       setError("User not found. Please register.");
  //       setIsLoading(false);
  //       return;
  //     }

  //     const { password: storedPassword } = JSON.parse(storedUser);
  //     const passwordMatch = await bcrypt.compare(password, storedPassword);

  //     if (passwordMatch) {
  //       const mockToken = `mock_token_${Date.now()}`;
  //       setToken(mockToken);
  //       localStorage.setItem("rawg_token", mockToken);
  //       alert("Login successful!");
  //       //navigate("/dashboard"); // Navigate to dashboard
  //     } else {
  //       setError("Invalid credentials. Please try again.");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     setError("Login failed. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="login-page">
      {/* <h1>Login Page</h1> */}
      <h1>{isRegistering ? "Register" : "Login"}</h1>
      {/* {token ? (
        <div>
          <p>Welcome to PixelOracle! You are logged in.</p>
          <button
            onClick={() => {
              setToken(null);
              localStorage.removeItem("rawg_token");
              alert("Logged out successfully.");
            }}
          >
            Log Out
          </button>
        </div>
      ) : (
        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
          {isRegistering && (
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Processing..." : isRegistering ? "Register" : "Log In"}
          </button>
          {error && <p className="error">{error}</p>}
        </form>
      )}
      {!token && (
        <p>
          {isRegistering ? (
            <>
              Already have an account?{" "}
              <button className="link-button" onClick={() => setIsRegistering(false)}>
                Log In
              </button>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <button className="link-button" onClick={() => setIsRegistering(true)}>
                Register
              </button>
            </>
          )}
        </p>
      )} */}
      {!isRegistering? (
        <div className='form-container'>
          <form className='form login-form' onSubmit={handleSubmit}>
            {/* Username input field */}
            <div className='form-group'>
              <label>Username: </label>
              <input
                className='form-input'
                type='text'
                name='username'
                value={loginData.username || ''}
                onChange={handleChange}
              />
            </div>
            {/* Password input field */}
            <div className='form-group'>
              <label>Password: </label>
              <input
                className='form-input'
                type='password'
                name='password'
                value={loginData.password || ''}
                onChange={handleChange}
              />
            </div>
            {/* Submit button for the login form */}
            <div className='form-group'>
              <button className='btn btn-primary' type='submit'>Login</button>
            </div>
            <div>
              <button className="link-button" type="button" onClick={(event: FormEvent) => {
                setIsRegistering(true);
                event.preventDefault();
              }}>Register</button>
            </div>   
          </form>         
        </div>
        ) : (
          <div className='form-container'>
            <form className='form registration-form' onSubmit={handleSubmitRegistration}>
              {/* Username input field */}
              <div className='form-group'>
                <label>Username: </label>
                <input
                  className='form-input'
                  type='text'
                  name='username'
                  value={registrationData.username || ''}
                  onChange={handleChangeR}
                />
              </div>
              {/* email input field */}
              <div className='form-group'>
                <label>Email: </label>
                <input
                  className='form-input'
                  type='text'
                  name='email'
                  value={registrationData.email || ''}
                  onChange={handleChangeR}
                />
              </div>
              {/* Password input field */}
              <div className='form-group'>
                <label>Password: </label>
                <input
                  className='form-input'
                  type='password'
                  name='password'
                  value={registrationData.password || ''}
                  onChange={handleChangeR}
                />
              </div>
              {/* Submit button for the login form */}
              <div className='form-group'>
                <button className='btn btn-primary' type='submit'>Register New User!</button>
              </div>
              <div>
                <button className="link-button" type="button" onClick={(event: FormEvent) => {
                  setIsRegistering(false);
                  event.preventDefault();
                }}>Return to Login</button>
              </div>
            </form>
            {/* <div>
              <button className="link-button" onClick={() => setIsRegistering(false)}>Return to Login</button>
            </div> */}
          </div>
        )
      }


      {/* <button className="home-button" onClick={() => navigate("/")}>
        Go Back to Home
      </button> */}
    </div>
  );
};

export default Login;

