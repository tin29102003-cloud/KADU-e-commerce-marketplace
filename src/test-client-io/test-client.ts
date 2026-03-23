import { io } from "socket.io-client";

import dotenv from "dotenv";
import { setupChatNotificationEvent, setupNotificationEvents } from "./event/notification";
import { setupPresenceEvents } from "./event/roomchat";
import { SocketRoomName } from "../constants/socket-contants";

dotenv.config({path: "../../.env"});
// console.log(process.env.TOKEN_TEST);
const BOMB_TOKEN = process.env.TOKEN_TEST || "fdgdfgdfgdfgdfg"; 
const id_hoi_thoai = 1;
// Khởi tạo kết nối và NHÉT COOKIE VÀO HEADER
const socket = io(process.env.SERVER || "http://localhost:6000", {
    extraHeaders: {
        Cookie: `_atkn=${BOMB_TOKEN}` // Truyền cookie y như trình duyệt
    }
    
});

socket.on("connect", () => {
    console.log(`[CLIENT]  Kết nối thành công! Vượt qua trạm kiểm duyệt!`);
    //các sự kiên join
    setupPresenceEvents(socket,id_hoi_thoai,BOMB_TOKEN )
});

setupNotificationEvents(socket);
setupChatNotificationEvent(socket);
socket.on("connect_error", (err) => {
    console.log(`[CLIENT]  Bị Server đá ra:`, err.message);
});

