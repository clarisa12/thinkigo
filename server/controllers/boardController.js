import { BoardModel } from "../models/BoardModel.js";
import { UserModel } from "../models/UserModel.js";

export const createNew = async (req, res) => {
    const { boardId, email, data, boardName } = req.body;

    const user = await UserModel.findOne({ email });
    const board = new BoardModel({
        boardId,
        author: user._id,
        data,
        boardName,
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

/**
 *
 * @param {string} boardId
 * @param {Object} data
 */
export const flushBoardData2Mongo = async (boardId, data) => {
    const objStr = JSON.stringify(data);
    return await BoardModel.updateOne(
        { boardId },
        { $set: { data: objStr, isDrawing: false } }
    );
};
