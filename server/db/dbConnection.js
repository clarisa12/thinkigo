import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose
    .connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8zb7v.mongodb.net/thinkigo?ssl=true&replicaSet=atlas-mtk3bl-shard-0&authSource=admin&retryWrites=true&w=majority`,
        {
            useNewUrlParser: true,
        }
    )
    .then((e) => {
        console.log(e);
    })
    .catch((e) => {
        console.error("Connection error", e.message);
    });

const dbConnection = mongoose.connection;

export default dbConnection;
