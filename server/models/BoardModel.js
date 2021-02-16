import mongoose from "mongoose";

const BoardSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    boardId: {
        type: String,
        unique: true,
        required: true,
        index: true,
    },
    thumbnail: { type: String },
    data: { type: String },
    name: { type: String },
    isDrawing: { type: Boolean },
});

export const BoardModel = mongoose.model("Board", BoardSchema);
