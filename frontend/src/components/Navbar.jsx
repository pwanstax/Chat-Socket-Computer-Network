import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import {checkLogin} from "../utils/auth";

import Config from "../assets/configs/configs.json";
import {cookieExists, deleteCookie} from "../utils/cookies";

const Navbar = () => {
  const [navbarInfo, setNavbarInfo] = useState(null);

  const handleLogout = async () => {
    localStorage.clear();
    (await cookieExists("username")) && (await deleteCookie("username"));
    (await cookieExists("userID")) && (await deleteCookie("userID"));
    await axios.post(
      `${Config.BACKEND_URL}/user/logout`,
      {
        cookie_name: "auth",
      },
      {
        withCredentials: true,
      }
    );

    window.location.assign("/");
  };

  useEffect(() => {
    const fetchNavbar = async () => {
      const result = await checkLogin();
      if (result) {
        try {
          const res = await axios.get(`${Config.BACKEND_URL}/user/navbar`, {
            headers: {
              user_id: localStorage.getItem("user_id"),
            },
            withCredentials: true,
          }); // change path to backend service
          setNavbarInfo(res.data);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchNavbar();
  }, []);

  return (
    <div className="navbar-container">
      <img
        src={require("../assets/images/chat-logo.jpg")}
        alt="logo"
        className="logo"
      />
      <div className="content-container">
        <nav>
          {navbarInfo ? (
            <>
              <h3 className="content">hi {navbarInfo.username}</h3>
              <Link className="content" onClick={handleLogout}>
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link to="/signin" className="content">
                Sign in
              </Link>
              <Link to="/signup" className="signup content">
                Create Account
              </Link>
            </>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
