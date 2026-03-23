import { ADMIN_ROLE_ID, ROLE_MAP, SHOP_VALUE } from "../config/explain";
import { buildRoom } from "../constants/socket-contants";
import { CustomSocket } from "../types/socket";
import { logger } from "../ultis/logger";
import { normalizeBoolean } from "../ultis/validate";
//cái này là các sự kiện
export const  handleRoomJoin = (socket: CustomSocket)=>{
    const user = socket.data.user;
    logger.info(`[SOCKET CONNECT] User ${user.id}  | is_shop: ${Boolean(user.is_shop)} )`);
    socket.join(buildRoom.user(user.id));
    if(normalizeBoolean(user.is_shop) === SHOP_VALUE){
        socket.join(buildRoom.shop(user.id));
        logger.info(`User ${user.id} đã thêm vào phòng shop`);
    }
    if(user.vai_tro === ADMIN_ROLE_ID){
        socket.join(buildRoom.admin());
        logger.info(`Admin ${user.id} đã vào phòng điều hành`);
    }
    
    socket.on("disconnect",()=>{
        logger.info(`User ${user.id} đã ngắt kết nối`);
    })
}