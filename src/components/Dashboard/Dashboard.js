import React, { useState } from "react";
import Navigation from "../Navigation/Navigation";
import "./Dashboard.css";
import Search from "./Search";
import { FaPlus } from "react-icons/fa";
import Modal from "react-modal";
import { Link } from "react-router-dom";

function Dashboard() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <div className="dashboard-container">
      <Navigation />
      <Search />
      <div id="boards-header-container">
        <h2 id="boards-header">Your boards:</h2>
      </div>
      <div className="boards-container">
        <div
          className="add-new-board-block"
          onClick={() => setModalIsOpen(true)}
        >
          <h3 className="add-new-board-text">New board</h3>
          <FaPlus id="add-new-board-icon" />
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
        >
          <Link to="/board">
            <h1>New board</h1>
          </Link>
          <button onClick={() => setModalIsOpen(false)}>close</button>
        </Modal>
        <div className="board-block">
          <h3 className="board-name">Board name</h3>
        </div>
        <div className="board-block">
          <h3 className="board-name">Board name</h3>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
