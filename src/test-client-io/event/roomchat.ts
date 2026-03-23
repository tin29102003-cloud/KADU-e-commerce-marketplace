
import { Socket } from "socket.io-client";
import { SocketRoomName } from "../../constants/socket-contants";


const server =  process.env.SERVER || "http://localhost:5000";

export const  setupPresenceEvents = (socket : Socket,id_hoi_thoai: number,token: string)=>{
    socket.emit(SocketRoomName.joinchat, {id_hoi_thoai: id_hoi_thoai});
    console.log(`Da vào room chả có ID là ${id_hoi_thoai}`);
    setTimeout(() => {
        testGuiTinNhanQuaApi(id_hoi_thoai,token);
        
        
    }, 2000);
    testHieuUngGoPhim(socket ,id_hoi_thoai);

    
    
}
const testGuiTinNhanQuaApi = async(
    id_hoi_thoai: number,
    token: string
)=>{
     
    console.log("Dang gọi HTTP gửi tin nhắn")
    try {
       
        const  res = await fetch(`${server}/api/site/chat/tin-nhan`,{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                'Cookie': `_atkn=${token}`
            },
            body: JSON.stringify({
                id_hoi_thoai: id_hoi_thoai,
                noi_dung: "test tin nhắn"
            })
        });
        
        
    } catch (error) {
        console.log(error);
    }
}
const testHieuUngGoPhim = (socket: Socket, id_hoi_thoai: number)=>{
    console.log("Tui đang gõ phím");
    socket.emit(SocketRoomName.typing, {
        id_hoi_thoai: id_hoi_thoai,
        is_typing: true
    });//sau 3 day dừng gõ
    setTimeout(() => {
        console.log("Tui đã gõ xong rồi");
        socket.emit(SocketRoomName.typing,{
            id_hoi_thoai: id_hoi_thoai,
            is_typing: false
        });
    }, 3000);
}