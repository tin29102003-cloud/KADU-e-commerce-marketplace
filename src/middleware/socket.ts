import { CustomSocket } from "../types/socket";
import { logger } from "../ultis/logger";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";
import { CustomJwtPayload } from "../types/auth";
import { User } from "../models";

import { CustomError } from "../types/appError";

export const socketAuthMiddleware = async(socket: CustomSocket, next:(err?: Error)=>void)=>{
    try {//return next error là stop midwware  báo lỗi
        const cookieString = socket.request.headers.cookie;
        if(!cookieString){
            return next(new Error("không có cookie!"));
        }
        const cookies = cookie.parse(cookieString);
        const token = cookies._atkn as string | undefined;
        if(!token){
            return next(new Error("Không tìm thấy token"));
        }
        const  secret = process.env.JWT_SECRET || 'co_cai_nit';
        const payload = jwt.verify(token, secret) as CustomJwtPayload;
        const user = await User.findByPk(payload.id,{
            attributes: ['id','tai_khoan','vai_tro','is_shop','token_version']
        });
        if(!user){
            logger.warn("[SOCKET AUth] Cảnh báo: Token trỏ tới User không tồn tại");
            return next(new Error("Người dùng không tồn tại"))
        }
        if(user.token_version !== payload.token_version) return next((new Error("Token hết hạn")));
        socket.data.user = user.toJSON();
        next();
    } catch (err: any) {
        
        logger.warn(`[SOCKET AUTH] Xâm nhập thất bại hoặc Token hết hạn: ${err.message} | IP: ${socket.handshake.address}`);
        return next(new Error("Token không hợp lệ hoặc hết hạn"));

    }
    
}