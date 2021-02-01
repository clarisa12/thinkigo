import React from "react";
import { Link } from "react-router-dom";

function Navigation() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/">home</Link>
        </li>
        <li>
          <Link to="/board">board</Link>
        </li>
      </ul>
    </div>
  );
}

export default Navigation;
