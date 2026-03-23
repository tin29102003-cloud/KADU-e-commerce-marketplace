import { Server } from "socket.io";
import { CustomSocket } from "../types/socket";

export const logAllActiveUsers = (io: Server) => {
    // io.sockets.sockets là một Map chứa toàn bộ kết nối hiện tại
    const allSockets = io.sockets.sockets;

    console.log(`\n========== ĐANG CÓ ${allSockets.size} KẾT NỐI ONLINE ==========`);

    allSockets.forEach((socket: CustomSocket) => {
        // Lấy data bạn đã gắn vào ở middleware
        const userData = socket.data.user.id; 

        console.log(`> Socket ID: ${socket.id}`);
        if (userData) {
            // Log thông tin user "xịn" đã login
            console.log(`  User:`, userData); 
        } else {
            // Trường hợp socket kết nối nhưng chưa qua auth hoặc auth lỗi
            console.log(`  User: Khách (Chưa định danh)`);
        }
    });

    console.log(`====================================================\n`);
};