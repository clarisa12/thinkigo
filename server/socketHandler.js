import { flushBoardData2Mongo } from "./controllers/boardController.js";
import { Server } from "socket.io";

import redis from "./redis.js";

// Keep track of # connected clients
// in order to flush the data from redis into mongo-db
// after last client leaves the room
const connectedUsers = new Map();

export default function io(server) {
    /* creating a new socket.io server instance */
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    function connectionHandler(socket) {
        // ==================
        // Events
        socket.on("join", joinRoomHandler);
        socket.on("disconnect", disconnectHandler);

        // ==================
        // Handlers
        function joinRoomHandler(room) {
            console.info(`Client ${socket.id} joined room ${room}`);

            socket.join(room);
            // Attach room id to socket object
            socket.room = room;
            connectedUsers.set(room, connectedUsers.get(room) + 1 || 1);

            // Whenever a new client connects check if there is data on redis

            if (connectedUsers.get(room) === 1) {
                // load from mongo database
            } else {
                // try redis
                redis.retrieve(room, (err, data) => {
                    if (data) {
                        socket.emit("draw", JSON.parse(data));
                    }
                });
            }

            // Emit drawing received from client
            socket.on("draw", drawHandler);

            function drawHandler(data) {
                redis.store(room, JSON.stringify(data));

                // broadcast to room
                socket.in(room).broadcast.emit("draw", data);
            }
        }

        function disconnectHandler() {
            const { room } = socket;
            connectedUsers.set(room, connectedUsers.get(room) - 1);
            if (connectedUsers.get(room) === 0) {
                //TODO: Flush redis data to mongo
                flushBoardData2Mongo(socket.room);
            }
        }
    }

    io.on("connection", connectionHandler);
}
