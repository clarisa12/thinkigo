import WebSocket from "ws";

console.log(process.env.WS_PORT);
const wss = new WebSocket.Server({ port: process.env.WS_PORT });

wss.on("connection", (ws) => {
    ws.on("message", (message) => {
        console.log(`Received message => ${message}`);
    });
    ws.send("ho!");
});

export default wss;
