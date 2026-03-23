import express from "express";
import { AdminChatSchema, AdminChatSInput, GetAllChatInput, GetAllChatSchema } from "../schema/chat.schema";
import validate from "../middleware/validate";
import { AuthUser } from "../types/express";
import { VAI_TRO_USER } from "../constants/chat";
import { ThanhVienHoiThoai, TinNhan, User } from "../models";
import { findOrCreateChatRoom } from "../ultis/chathelp";
import { CustomError } from "../types/appError";
import { logger } from "../ultis/logger";
import { GetAllChatQuery } from "../types/chat";
import { Op, WhereOptions } from "sequelize";
const router = express.Router();

router.post<{},{},AdminChatSInput, {}>('/khoi-tao',validate(AdminChatSchema), async(req, res)=>{
	try {
		const userPayLoad = req.user as AuthUser;
		const  id_nguoi_gui = userPayLoad.id;
		const vai_tro_nguoi_gui = VAI_TRO_USER.USER;
		const  {id_nguoi_nhan, vai_tro_nguoi_nhan} = req.body;
		if(id_nguoi_gui === id_nguoi_nhan) throw {status: 400, thong_bao: "Không thể tự chat với chính  mình"};
		const  receiver = await User.findByPk(id_nguoi_nhan);
		if(!receiver){
			throw {status: 404, thong_bao: "Người nhận không tồn tại"};
		}
		if(vai_tro_nguoi_nhan === 'SHOP' && !receiver.is_shop){
			throw {status: 403, thong_bao: "Lỗi bảo mật: người này không phải là chủ shop"};
		}
		const result = await findOrCreateChatRoom(id_nguoi_gui,vai_tro_nguoi_gui,id_nguoi_nhan,vai_tro_nguoi_nhan);
		return res.status(200).json({data: result, success: true});
	} catch (error) {
		const err = error as CustomError;
		const thong_bao = err.thong_bao || "Lỗi máy chủ khi tạo cuộc hội thoại";
		const status = err.status || 500;
		if(status >= 500){
			logger.error(`[CRITICAL] Lỗi APi khởi tạo cuộc hội thoại user ${err.message || 'Unknown error'}`, {stack: err.stack || 'No stack trace'});
		}
		return res.status(status).json({thong_bao, success: false});
	}
})




export default router;
