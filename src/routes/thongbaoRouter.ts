import { WhereOptions } from "sequelize";
import { ThongBao } from "../models";
import { AuthUser } from "../types/express";
import express from 'express';
import { GetAllThongBao, ParamsThongBaoByID, ThongBaoReadAll } from "../types/thong_bao";

import { CustomError } from "../types/appError";
import { logger } from "../ultis/logger";
import { THONG_BAO_SEEN, VAI_TRO_NHAN } from "../config/explain";
import { buildRoom, SocketRoomName } from "../constants/socket-contants";
const router = express.Router();
router.get<{},{},{},GetAllThongBao>('/',async(req, res)=>{
	try {
		const userPayload = req.user as  AuthUser;
		const  id_user = userPayload.id;
		const  page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
		const  limit = Number(req.query.limit) > 0 ? Number(req.query.limit) : 10;
		const loai_tb = req.query.loai_thong_bao as string;
		const whereCondition : WhereOptions<ThongBao> = {id_user, vai_tro_nhan: VAI_TRO_NHAN.ADMIN}
		if(loai_tb){
			whereCondition.loai_thong_bao = loai_tb
		}
		const  offset = (page - 1) * limit;
		const  {rows, count} = await ThongBao.findAndCountAll({
			where: whereCondition,
			limit: limit,
			offset: offset,
			order: [['createdAt','DESC']]
		});
		const totalPages = Math.ceil(count / limit);
		const  resData = {
			result :{
				data: rows,
				pagination: {
					CurrentPage : page,
					totalItem : count,
					limit: limit,
					totalPages: totalPages
				},
				success: true
			}
		}
		return res.status(200).json(resData)
	} catch (error) {
		const err = error as CustomError;

		logger.error(`[CRITICAL] Lỗi APi  lấy danh sách thông báo người dùng ${err.message || 'Unknown error'}`, {stack: err.stack || 'No stack trace'});
		return res.status(500).json({thong_bao: "Lỗi máy chủ khi lấy danh sách thông báo", success: false})
	}
})
router.put<ParamsThongBaoByID>('/:id/da-doc', async(req, res)=>{
    try {
        const  {id} = req.params;
        const userPayload = req.user as AuthUser;
        const id_user = userPayload.id;
        const thongBao = await ThongBao.findOne({where: {id, id_user: id_user, da_doc: THONG_BAO_SEEN.CHUA_DOC}});
        if(!thongBao){
            throw {status: 404, thong_bao: "Không tìm thấy thông báo"};
        }
        thongBao.da_doc = THONG_BAO_SEEN.DA_DOC
        await thongBao.save();
        try {
            const io = req.app.get('io');
            io.to(buildRoom.admin()).emit(SocketRoomName.notificationRead, { id_thong_bao: Number(id) });
        } catch (socketErr) {
            const err = socketErr as CustomError;
            logger.error(`[SOCKET WARNING] Lỗi bắn thông báo đã đọc: ${err.message}`, { stack: err.stack });
        }
        return res.status(200).json({thong_bao: "Đã đánh dấu đọc cho  thông báo", success: true})
    } catch (error) {
        const err = error as  CustomError;
        const status = err.status || 500;
        const thong_bao = err.thong_bao || "Lỗi máy chủ  khi đánh dấu  đã đọc cho thông báo"
        if(status >= 500){
            logger.error(`[CRITICAL] Lỗi APi đọc 1 thông báo của admin ${err.message || 'Unknown error'}`, {stack: err.stack || 'No stack trace'});
        }
        return res.status(status).json({thong_bao, success: false})
        
    }
})
router.put<{},{},{},ThongBaoReadAll>('/da-doc-het', async(req, res)=>{
    try {
        const userPayload = req.user as AuthUser;
        const loai_tb = req.query.loai_thong_bao  as  string;
        const id_user = userPayload.id;
        const whereCondition: WhereOptions<ThongBao> = {id_user, vai_tro_nhan: VAI_TRO_NHAN.ADMIN, da_doc: THONG_BAO_SEEN.CHUA_DOC};
        if(loai_tb) whereCondition.loai_thong_bao = loai_tb;
        await ThongBao.update({
            da_doc: THONG_BAO_SEEN.DA_DOC
        },{
            where: whereCondition
        })
        try {
            const io = req.app.get('io');
            io.to(buildRoom.admin()).emit(SocketRoomName.notificationRead, { loai_thong_bao: loai_tb || 'ALL' });
        } catch (socketErr) {
            const err = socketErr as CustomError;
            logger.error(`[SOCKET WARNING] Lỗi bắn thông báo đã đọc hết : ${err.message}`, { stack: err.stack });
        }
        return res.status(200).json({thong_bao: "Đã đọc hết thông báo", success: true});
    } catch (error) {
        const err = error as CustomError;
        logger.error(`[CRITICAL] Lỗi APi đọc hêt thông báo  ${err.message || 'Unknown error'}`, {stack: err.stack || 'No stack trace'});
        return res.status(500).json({thong_bao: "Lỗi máy chủ khi đọc hết thông báo", success: false});
    }
})
router.get<{},{},{},ThongBaoReadAll>('/chua-doc/count',async(req , res)=>{
    try {
        const userPayload = req.user as AuthUser;
        const  id_user = userPayload.id;
        const loai_tb = req.query.loai_thong_bao as  string;
        const  whereCondition: WhereOptions<ThongBao> = {id_user, da_doc: THONG_BAO_SEEN.CHUA_DOC, vai_tro_nhan: VAI_TRO_NHAN.ADMIN};
        if(loai_tb){
            whereCondition.loai_thong_bao = loai_tb
            
        }
        const notificationUnReadCount = await ThongBao.count({
            where: whereCondition
        });
        return res.status(200).json({data: notificationUnReadCount, success: true});
    } catch (error) {
        const err = error as CustomError;
        logger.error(`[CRITICAL] Lỗi APi đếm sô  lượng thông báo chưa đọc ${err.message || 'Unknown error'}`, {stack: err.stack || 'No stack trace'});
        return res.status(500).json({thong_bao: "Lỗi khi đếm thông báo chưa đọc", success: false});

    }
})
router.delete('/xoa-thong-bao', async(req, res)=>{
    try {
        const userPayload = req.user as AuthUser;
        const id_user = userPayload.id;
        
        const deleteCount  = await ThongBao.destroy({where: {id_user, vai_tro_nhan: VAI_TRO_NHAN.ADMIN}});
        if(deleteCount === 0){
            return res.status(200).json({
                success: true,
                thong_bao: "Không có thông báo nào để xóa"
            });
        }
        try {
            const io = req.app.get('io');
            io.to(buildRoom.admin()).emit(SocketRoomName.notificationDelete, {loai_thong_bao: 'ALL'});
        } catch (socketErr) {
            const err = socketErr as CustomError;
            logger.error(`[SOCKET WARNING] Lỗi xóa  hết thông báo : ${err.message}`, { stack: err.stack });
        }
        return res.status(200).json({thong_bao: "Đã xóa hết thông báo", success: true});
    } catch (error) {
        const err = error as CustomError;
        logger.error(`[CRITICAL] Lỗi APi  xóa hết thông báo ${err.message || 'Unknown error'}`, {stack: err.stack || 'No stack trace'});
        return res.status(500).json({thong_bao: "Lỗi máy chủ khi xóa hết thông báo", success: false});
    }
})
export default router;