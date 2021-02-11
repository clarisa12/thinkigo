import { BoardModel } from "../models/BoardModel.js";
import { UserModel } from "../models/UserModel.js";

export const createNew = async (req, res) => {
  const { board_id, email, data, board_name } = req.body;

  const user = await await UserModel.findOne({ email });
  const board = new BoardModel({
    board_id,
    author: user._id,
    data,
    board_name,
  });

  try {
    await board.save();
    console.log("here");
    return res.status(201).json({
      success: true,
      message: "Board created!",
    });
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      error,
      message: "Not created",
    });
  }
};
