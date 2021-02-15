import React, { useState, useContext, useEffect } from "react";
import Navigation from "../Navigation/Navigation";
import "./Dashboard.css";
import Search from "./Search";
import { FaPlus, FaPencilAlt, FaGamepad } from "react-icons/fa";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import { fetchWrapper } from "../../fetchWrapper";
import AuthService from "../../AuthService";
import { uid } from "uid";
import { generatePath } from "react-router";

function Dashboard() {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [boards, setBoards] = useState([]);
    const boardId = { drawing: null, quiz: null };

    function fetchBoards() {
        return fetchWrapper(
            `/board/retrieve?email=${AuthService.getUserData().email}`,
            "GET"
        );
    }

    useEffect(() => {
        fetchBoards().then((res) => setBoards(res.boards));
    }, []);

    function saveBoardInDb() {
        fetchWrapper("/board/new", "POST", {
            boardId,
            email: AuthService.getUserData().email,
        });
    }

    function createNewBoardPath(type) {
        const id = uid(16);

        boardId[type] = id;

        return generatePath("/board/:id", {
            id,
        });
    }

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
                        <Link
                            to={() => createNewBoardPath("drawing")}
                            onClick={() => saveBoardInDb("drawing")}
                        >
                            <div className="add-new-board-block-modal">
                                <h2 id="modal-block-text">New drawing board</h2>
                                <FaPencilAlt id="modal-icon" />
                            </div>
                        </Link>
                        <Link
                            to={() => createNewBoardPath("quiz")}
                            onClick={() => saveBoardInDb("quiz")}
                        >
                            <div className="add-new-board-block-modal">
                                <h2 id="modal-block-text">New quiz board</h2>
                                <FaGamepad id="modal-icon" />
                            </div>
                        </Link>
                    </div>
                </Modal>
                {boards.map((board) => (
                    <div className="board-block" key={board.boardId}>
                        <Link to={`/board/${board.boardId}`}>
                            <h3 className="board-name">{board.boardId}</h3>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
