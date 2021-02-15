import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";
import {
  FaLayerGroup,
  FaBell,
  FaUserAlt,
  FaUserPlus,
  FaQuestionCircle,
} from "react-icons/fa";

function Navigation() {
  const [showNotifications, setShowNotifications] = useState(false);

  if (showNotifications) {
    setTimeout(() => {
      setShowNotifications(false);
    }, 7000);
  }

  return (
    <div id="nav-container">
      <div id="nav-container-first-row">
        <Link to="/">
          <FaLayerGroup className="nav-icon" />
        </Link>
        <Link to="/">
          <FaBell
            className="nav-icon"
            onClick={() => {
              setShowNotifications(!showNotifications);
            }}
          />
          <div id="bell-length">1</div>
        </Link>
        <div
          className={
            showNotifications
              ? "notifications-popup active"
              : "notifications-popup"
          }
        >
          <p>You don't have any new notifications</p>
        </div>
      </div>
      <div id="nav-container-second-row">
        <FaUserPlus className="nav-icon" />
        <div id="userplus-length">9</div>
        <Link to="/notifications">
          <FaQuestionCircle className="nav-icon" />
        </Link>
        <FaUserAlt className="nav-icon" />
      </div>
    </div>
  );
}

export default Navigation;
