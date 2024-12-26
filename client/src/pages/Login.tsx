import { useState, FormEvent, ChangeEvent } from "react";
import Auth from '../utils/auth';
import { login, newUser } from '../api/authAPI';
import type { UserLogin } from '../interfaces/UserLogin';
import type { RegisterUser } from "../interfaces/RegisterUser";

const Login = () => {
  // useState to track if the user is registering or logging in
  const [isRegistering, setIsRegistering] = useState(false);

  // useState to hold user login credentials
  const [loginData, setLoginData] = useState<UserLogin>({
    username: '',
    password: '',
  });

  // useState to hold user registration information
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

  // Handle form submission for LOGIN
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

  // Handle form submission for REGISTRATION
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

  return (
    <div className="login-page">
      <h1>{isRegistering ? "Register" : "Login"}</h1>
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
              <button className='btn btn-primary' type='submit' onSubmit={(event: FormEvent) => {event.stopPropagation()}}>Login</button>
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
                <button className='btn btn-primary' type='submit' onSubmit={(event: FormEvent) => {event.stopPropagation()}}>Register New User!</button>
              </div>
              <div>
                <button className="link-button" type="button" onClick={(event: FormEvent) => {
                  setIsRegistering(false);
                  event.preventDefault();
                }}>Return to Login</button>
              </div>
            </form>
          </div>
        )
      }
    </div>
  );
};

export default Login;
