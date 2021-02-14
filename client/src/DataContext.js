import React, { useState, createContext } from "react";
import { fetchWrapper } from "./fetchWrapper";
import AuthService from "./AuthService";
import { uid } from "uid";
import { generatePath } from "react-router";

export const DataContext = createContext();

export const DataProvider = (props) => {
    const [image, setImage] = useState();
    const [boardName, setBoardName] = useState("");
    const [currentId, setCurrentId] = useState();

    let boardId = null;

    function saveBoardInDb() {
        fetchWrapper("/board/new", "POST", {
            boardId,
            email: AuthService.getUserData().email,
            data: image,
            boardName: boardName,
        });
    }

    function createNewBoardId() {
        boardId = uid(25);

        return generatePath("/board/:id", {
            id: boardId,
        });
    }

    const getBoards = () => {
        return fetchWrapper("/", "GET", {
            email: AuthService.getUserData().email,
        });
    };

    return (
        <DataContext.Provider
            value={{
                image,
                setImage,
                saveBoardInDb,
                createNewBoardId,
                getBoards,
                setBoardName,
                boardName,
                currentId,
                setCurrentId,
            }}
        >
            {props.children}
        </DataContext.Provider>
    );
};
