import { createServer } from "http";
import { Server, Socket } from "socket.io";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

/**
 *
 * @param {Socket} socket
 */
const socketListener = (socket) => {
  socket.on("send-coords", (coords) => {
    socket.broadcast.emit("receive-coords", coords);
  });

  socket.on("start-drawing", (coords) => {
    socket.broadcast.emit("start-drawing", coords);
  });

  socket.on("stop-drawing", () => {
    socket.broadcast.emit("stop-drawing");
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
  });
};

io.on("connection", socketListener);

httpServer.listen(4040);

export default io;
