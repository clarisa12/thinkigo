import { flushBoardData2Mongo } from "./controllers/boardController.js";
import { Server } from "socket.io";

import redis from "./redis.js";

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
      console.info(
        `Client ${room.name} ${socket.id} joined room ${room.roomId}`
      );

      socket.join(room.roomId);
      // Attach room id to socket object
      socket.room = room.roomId;
      connectedUsers.set(room.roomId, connectedUsers.get(room.roomId) + 1 || 1);
      let userData = {
        name: room.name,
        id: socket.id,
      };
      if (users.includes(userData.id) === false) users.push(userData);
      socket.emit("users", users);

      // Whenever a new client connects check if there is data on redis

      if (connectedUsers.get(room.roomId) === 1) {
        // load from mongo database
      } else {
        // try redis
        redis.retrieve(room.roomId, (err, data) => {
          if (data) {
            socket.emit("draw", JSON.parse(data));
          }
        });
      }

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
      let index = getUserById(socket.id);
      if (index > -1) users.splice(index, 1);
      socket.emit("users", users);
      connectedUsers.set(room, connectedUsers.get(room) - 1);
      if (connectedUsers.get(room) === 0) {
        //TODO: Flush redis data to mongo
        flushBoardData2Mongo(socket.room);
      }
    }
  }

  io.on("connection", connectionHandler);
}
