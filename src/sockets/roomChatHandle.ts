import { ChatRoom, SocketRoomName } from "../constants/socket-contants";
import { CustomSocket } from "../types/socket";
//payload là cái sẽ chuyền vao socket on nó sẽ thay đổi liên tục ko cố định như usser
export const handleChatEvents = (socket: CustomSocket) => {
    const curentUser = socket.data.user;
    socket.on(SocketRoomName.joinchat,(payload: {id_hoi_thoai: number})=>{
        if(!payload || !payload.id_hoi_thoai) return;
        const roomName = ChatRoom(payload.id_hoi_thoai);
        socket.join(roomName);
        console.log(`[Socket] User ID ${curentUser.id} đã JOIN phòng: ${roomName}`);
    });

    //xin rồi phòng
    socket.on(SocketRoomName.leavechat, (payload: {id_hoi_thoai: number})=>{
        if(!payload || !payload.id_hoi_thoai) return;
        const roomName = ChatRoom(payload.id_hoi_thoai);
        socket.leave(roomName);
        console.log(`[Socket] User ID ${curentUser.id} đã LEAVE phòng: ${roomName}`);
    });

    //đang gõ phím
    socket.on(SocketRoomName.typing, (payload: {id_hoi_thoai: number, is_typing: boolean})=>{
        if(!payload || !payload.id_hoi_thoai) return;
        const roomName = ChatRoom(payload.id_hoi_thoai);
        //cho biết phòng là đối phuong đang gõ phím
        socket.to(roomName).emit(SocketRoomName.usertyping,{
            id_user: curentUser.id,
            is_typing: payload.is_typing
        });
        
    });
}