import { Socket } from "socket.io-client";
import { logger } from "../../ultis/logger";
import { Console } from "console";
import { SocketRoomName } from "../../constants/socket-contants";
export const setupNotificationEvents = (socket: Socket)=>{
    socket.on(SocketRoomName.notificationNew, (data)=>{
        console.log("[Thông Báo Mới Tới nè]");
        console.log(`[Dữ liệu]`,data)
    })
    socket.on(SocketRoomName.notificationRead,(data)=>{
        console.log("[đã đọc thong báo]");
        console.log(['[Dữ liệu]',data]);
    })
     socket.on(SocketRoomName.notificationDelete,(data)=>{
        console.log("[đã xóa hết thông báo thong báo]");
        console.log(['[Dữ liệu]',data]);
    })
    socket.on(SocketRoomName.forceLogout, (data) => {
    // alert(data.thong_bao);
    console.log(data.thong_bao);
    // Xóa state user, gọi api logout, hoặc redirect thẳng về trang chủ/login
    // window.location.href = process.env.LOGIN_URL||"http://localhost:3000/dang-nhap"; 
});
}
export const setupChatNotificationEvent = (socket: Socket)=>{
    socket.on(SocketRoomName.receivemessage,(data)=>{
        console.log("Tin nhắn mới tới nè");
        console.log("Dữ liệu",data);
        // socket.emit(SocketRoomName.leavechat, {id_hoi_thoai: 1});

        
    })
    socket.on(SocketRoomName.usertyping,(data)=>{
        if(data.is_typing){
            console.log(`User Id ${data.id_user} đang gõ phím`);
        }else{
            console.log(`User Id ${data.id_user} đã dừng gõ phím`);
        }
    })
    socket.on(SocketRoomName.readMessage,(data)=>{
        console.log("đã đọc hết tin nhắn gòi nhá bro",data);
    })
    socket.on(SocketRoomName.recallMessage, (data)=>{
        console.log("tin nhắn đã đc thu hồi",data);
    })
    
}