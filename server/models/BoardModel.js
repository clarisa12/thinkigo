import mongoose from "mongoose";

const BoardSchema = new mongoose.Schema({
    // TODO: Add board fields
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    board_id: {
        type: String,
        unique: true,
        required: true,
        index: true,
    },

    // data should probably be a reproducible representation of the board, one that can be loaded by the canvas element
    // more info: https://stackoverflow.com/questions/34577846/saving-and-loading-canvas-data-from-localstorage
    // Base64 encoded image
    thumbnail: { type: String },
    data: { type: String },
});

export const BoardModel = mongoose.model("Board", BoardSchema);
