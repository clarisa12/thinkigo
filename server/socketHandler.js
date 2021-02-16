import {
    flushBoardData2Mongo,
    getBoardData,
} from "./controllers/boardController.js";
import { Server } from "socket.io";

import redis from "./redis.js";

const logInfo = (socket, room, db) => {
    console.info(
        `Client ${socket.id} joined room ${room}\nUsing: ${db.toUpperCase()}`
    );
};

// Keep track of # connected clients
// in order to flush the data from redis into mongo-db
// after last client leaves the room
const connectedUsers = new Map();
const users = [];

export default function io(server) {
    /* creating a new socket.io server instance */
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    const getUserById = (id) => {
        for (let i = 0; i < users.length; i++) {
            if (users[i].id === id) return i;
        }
        return -1;
    };

    function connectionHandler(socket) {
        // ==================
        // Events
        socket.on("join", joinRoomHandler);
        socket.on("disconnect", disconnectHandler);

        // ==================
        // Handlers
        function joinRoomHandler(room) {
            socket.join(room.roomId);
            // Attach room id to socket object
            socket.room = room.roomId;

            connectedUsers.set(
                room.roomId,
                connectedUsers.get(room.roomId) + 1 || 1
            );
            let userData = {
                name: room.name,
                id: socket.id,
            };
            if (users.includes(userData.id || userData.name) === false)
                users.push(userData);

            // Whenever a new client connects check if there is data on redis
            if (connectedUsers.get(room.roomId) === 1) {
                // load from mongo database
                getBoardData(room.roomId).then((board) => {
                    logInfo(socket, room, "mongo");
                    // load data in memory on redis
                    if (board && board.data) {
                        redis.store(room.roomId, board.data);
                        socket.emit("draw", JSON.parse(board.data));
                    }
                });
            } else {
                logInfo(socket, room.roomId, "redis");
                // try to get from redis
                redis.retrieve(room.roomId, (err, data) => {
                    if (data) {
                        socket.emit("draw", JSON.parse(data));
                    }
                });
            }

            setInterval(() => {
                socket.in(room.roomId).broadcast.emit("users", users);
            }, 5000);

            // setTimeout(() => {
            //   clearInterval(interval);
            // }, 7000);
            // Emit drawing received from client
            socket.on("draw", drawHandler);

            function drawHandler(data) {
                redis.store(room.roomId, JSON.stringify(data));

                // broadcast to room
                socket.in(room.roomId).broadcast.emit("draw", data);
            }
        }

        function disconnectHandler() {
            const { room } = socket;
            connectedUsers.set(room, connectedUsers.get(room) - 1);
            let index = getUserById(socket.id);
            if (index > -1) users.splice(index, 1);
            socket.in(room).broadcast.emit("users", users);
            if (connectedUsers.get(room) === 0) {
                redis.retrieve(socket.room, (err, data) => {
                    // cleanup memory associated with room
                    redis.delete(socket.room);
                    flushBoardData2Mongo(socket.room, data);
                });
            }
        }
    }

    io.on("connection", connectionHandler);
}
