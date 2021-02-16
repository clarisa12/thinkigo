import { BoardModel } from "../models/BoardModel.js";
import { UserModel } from "../models/UserModel.js";

export const createNew = async (req, res) => {
    const { boardId, email, name } = req.body;

    const user = await UserModel.findOne({ email });
    const board = new BoardModel({
        boardId,
        author: user._id,
        name,
    });

    try {
        await board.save();
        return res.status(201).json({
            success: true,
            message: "Board created!",
        });
    } catch (error) {
        return res.status(400).json({
            error,
            message: "Not created",
        });
    }
};

export const getUserBoards = async (req, res) => {
    const { email } = req.query;

    try {
        const user = await UserModel.findOne({ email });
        const boards = await BoardModel.find({
            author: user._id,
        });

        return res.status(200).json({
            success: true,
            boards,
        });
    } catch (error) {
        return res.status(400).json({
            error,
            message: "Not created",
        });
    }
};

/**
 *
 * @param {string} boardId
 * @param {Object} data
 */
export const flushBoardData2Mongo = async (boardId, data) => {
    return await BoardModel.updateOne(
        { boardId },
        { $set: { data, isDrawing: false } }
    );
};

export const getBoardData = async (boardId) => {
    return await BoardModel.findOne({ boardId });
};
