import React from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";
import { FaLayerGroup, FaBell } from "react-icons/fa";

function Navigation() {
  return (
    <div id="nav-container">
      <ul>
        <li>
          <Link to="/dashboard">
            <FaLayerGroup id="nav-icon" />
          </Link>
        </li>
        <li>
          <Link to="/notifications">
            <FaBell id="nav-icon" />
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Navigation;
