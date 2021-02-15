import React, { useState, useContext } from "react";
import Navigation from "../Navigation/Navigation";
import "./Dashboard.css";
import Search from "./Search";
import { FaPlus, FaPencilAlt, FaGamepad } from "react-icons/fa";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import { DataContext } from "../../DataContext";

function Dashboard() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { saveBoardInDb, createNewBoardId, getBoards } = useContext(
    DataContext
  );

  const customStyles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.50)",
      overflow: "hidden",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      width: "50%",
      height: "70%",
      bottom: "auto",
      border: "none",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "rgba(0,0,0, 0)",
      overflow: "hidden",
    },
  };

  getBoards();

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
          style={customStyles}
          id="modal"
        >
          <div className="modal-container">
            <Link to={createNewBoardId} onClick={saveBoardInDb}>
              <div className="add-new-board-block-modal">
                <h2 id="modal-block-text">New drawing board</h2>
                <FaPencilAlt id="modal-icon" />
              </div>
            </Link>
            <Link to={createNewBoardId}>
              <div className="add-new-board-block-modal">
                <h2 id="modal-block-text">New quiz board</h2>
                <FaGamepad id="modal-icon" />
              </div>
            </Link>
          </div>
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
