import React from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";
import { FaLayerGroup, FaBell } from "react-icons/fa";

function Navigation() {
  return (
    <div id="nav-container">
      <div className="nav-icons-container">
        <ul>
          <li>
            <Link to="/">
              <FaLayerGroup className="nav-icon" />
            </Link>
          </li>
          <li>
            <Link to="/notifications">
              <FaBell className="nav-icon" />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navigation;
