import { Server } from "socket.io";
import { Application } from "express";
import http from 'http';

import { socketAuthMiddleware } from "./middleware/socket";
import { CustomSocket } from "./types/socket";
import { handleRoomJoin } from "./sockets/roomHandler";
import { logAllActiveUsers } from "./sockets/CountManyUser";
import { handleChatEvents } from "./sockets/roomChatHandle";
export const setupSocket = (server: http.Server, app: Application) =>{
    const io = new Server(server,{
        cors: {
            origin: process.env.CLIENT || "http://localhost:3000",
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
            credentials: true
        }
    });
    app.set('io',io);//set vào biền io để cacc router khac xài
    io.use(socketAuthMiddleware);
    io.on("connection", (socket: CustomSocket)=>{
        handleRoomJoin(socket);
        handleChatEvents(socket)
        logAllActiveUsers(io);
        
    })
    return io;
}