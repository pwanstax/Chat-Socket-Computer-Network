import React, {useState, useEffect} from "react";
import axios from "axios";
import Config from "../assets/configs/configs.json";
import {useForm} from "react-hook-form";

const Signin = ({signin, signup}) => {
  const [resError, setResError] = useState("");
  const [linkGoogle, setGoogleUrl] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm({mode: "all"});

  const handleSignUp = async (event) => {
    const {email, password} = event;
    const data = {user: {username: email, email, password}};

    try {
      await axios.post(`${Config.BACKEND_URL}/user`, data);
      window.location.assign("/");
    } catch (error) {
      console.error(error);
      handleShowResError(error.response.data.error);
    }
  };

  const handleSignIn = async (event) => {
    const {email, password} = event;
    const data = {user: {email, password}};

    try {
      const res = await axios.post(`${Config.BACKEND_URL}/user/login`, data, {
        withCredentials: true,
      });
      const user_id = res.headers.user_id;
      const username = res.headers.username;
      localStorage.setItem("user_id", user_id);
      localStorage.setItem("username", username);

      window.location.assign("/");
    } catch (error) {
      console.error(error);
      handleShowResError(
        error?.response?.data?.error
          ? error.response.data.error
          : "usernam or password is invalid"
      );
    }
  };

  const handleShowResError = (text) => {
    setResError(text);
    setTimeout(() => {
      setResError("");
    }, 3000);
  };

  useEffect(() => {
    setGoogleUrl(`${Config.BACKEND_URL}/auth/google`);
  }, []);

  return (
    <div className="signin-container">
      <div className="signin-box">
        <h2>{signup ? "Create New Account" : "Sign in"}</h2>
        <form
          onSubmit={handleSubmit(signup ? handleSignUp : handleSignIn)}
          className="signin-form"
        >
          <label>Username</label>
          <input
            id="email"
            className={errors.email ? "error-validate" : ""}
            {...register("email", {
              required: "Username is required",
            })}
          />
          {errors.email?.message && (
            <span className="error">{errors.email?.message}</span>
          )}
          <label>Password</label>
          <input
            id="password"
            type="password"
            className={errors.password ? "error-validate" : ""}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: signup ? 8 : 0,
                message: "Password required 8 characters",
              },
            })}
          />
          {errors.password?.message && (
            <span className="error">{errors.password?.message}</span>
          )}
          {signup && (
            <>
              <label>Confirm password</label>
              <input
                id="confirmPassword"
                type="password"
                className={errors.confirmPassword ? "error-validate" : ""}
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (val) => {
                    if (watch("password") !== val) {
                      return "Passwords do not match";
                    }
                  },
                })}
              />
              {errors.confirmPassword?.message && (
                <span className="error">{errors.confirmPassword?.message}</span>
              )}
            </>
          )}

          <button type="submit">{signup ? "Get Started" : "Sign in"}</button>
          {resError && <span className="error">{resError}</span>}
        </form>
        <div className="divider">
          <hr />
          <p>or</p>
          <hr />
        </div>
        <a href={linkGoogle} className="btn-google">
          <img
            src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png"
            alt="Google logo"
          />
          <span>Continue with Google</span>
        </a>
      </div>
    </div>
  );
};

export default Signin;
