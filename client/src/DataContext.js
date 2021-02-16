import React, { useState, createContext } from "react";

export const DataContext = createContext();

export const DataProvider = (props) => {
    const [boardName, setBoardName] = useState("");

    return (
        <DataContext.Provider
            value={{
                setBoardName,
                boardName,
            }}
        >
            {props.children}
        </DataContext.Provider>
    );
};
