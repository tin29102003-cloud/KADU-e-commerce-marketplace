import express, { Request, Response } from 'express';
const router = express.Router();
import { sequelize } from '../config/database';
import { changeStatusDonHangInput, changeStatusDonHangSchema, getDonHangDetailInput, getDonHangDetailSchema } from '../schema/donhang.schema';
import validate from '../middleware/validate';

import {  ADMIN_ROLE_ID, DON_HANG_DA_CHUA_XAC_NHAN, DON_HANG_DA_GIAO_VALUE, DON_HANG_DANG_GIAO_VALUE, DON_HANG_HUY_VALUE, DON_HANG_SHOP_CHUAN_BI_HANG_VALUE, LOAI_THONG_BAO, THANH_TOAN_THANH_CONG_VALUE, VAI_TRO_NHAN } from '../config/explain';
import { DonHangWithChiTiet, GetallDonHang } from '../types/don_hang';
import { DonHang, DonHangChiTiet, KhuyenMaiUser, PTTT, SanPham, SanPhamBienThe, ThongBao, User, Voucher } from '../models';
import { Op, WhereOptions } from 'sequelize';
import { normalizeBoolean } from '../ultis/validate';
import { CustomError } from '../types/appError';
import { logger } from '../ultis/logger';
import { noficationType, STATUS_MAP, thongBaoTemplate } from '../constants/thong_bao';
import { buildRoom, SocketRoomName } from '../constants/socket-contants';



router.put<changeStatusDonHangInput['params'],{},changeStatusDonHangInput['body']>('/trang-thai/:id',validate(changeStatusDonHangSchema),async(req: Request ,res: Response)=>{
    const t = await sequelize.transaction();
    try {
        const {id} = req.params;
        const {ly_do, trang_thai_moi} = req.body;
        const donHang = await DonHang.findOne({
            where: {id: id},
            include: [{
                model: DonHangChiTiet,
                as: 'chi_tiet_dh',
                attributes: ['id_sp','id_bt','so_luong']
            }],
            transaction: t,
            lock: true
        });
        if(!donHang){
            throw {status: 404, thong_bao: "Dơn hàng không tồn tại"};
        }
        const trang_thai_cu = donHang.trang_thai_dh;
        if(trang_thai_cu === DON_HANG_DA_GIAO_VALUE || trang_thai_cu === DON_HANG_HUY_VALUE){
            throw {status: 400, thong_bao: "Đơn hàng đã kết thúc không thể thay đổi trạng thái"};
        }
        if(trang_thai_moi < trang_thai_cu){
            throw {status: 400, thong_bao: "Không thể quay ngược trạng thái đơn  hàng"};
        }
        const updateData: Partial<DonHang> = {
            trang_thai_dh: trang_thai_moi
        };
        if(trang_thai_moi === DON_HANG_HUY_VALUE){
            updateData.ly_do_huy = ly_do || "admin đã hủy đơn  hàng"
        }
        if(trang_thai_moi === DON_HANG_DA_GIAO_VALUE && normalizeBoolean(donHang.trang_thai_thanh_toan) === 0){
                updateData.trang_thai_thanh_toan = THANH_TOAN_THANH_CONG_VALUE;
            }
        await donHang.update(updateData,{transaction: t});
        const donHangItem = donHang.toJSON() as DonHangWithChiTiet;
        //nếu set trạng thai mới hủy thì hoàn kho  hoàn voucher cho khách  hàng
        if(trang_thai_moi === DON_HANG_HUY_VALUE){
            
            if(donHangItem.chi_tiet_dh){
                for(const item of donHangItem.chi_tiet_dh){
                    
                    if(item.id_bt){
                        await SanPhamBienThe.increment('so_luong',{by: item.so_luong, where: {id: item.id_bt}, transaction: t});
                    }else{
                        await SanPham.increment('so_luong',{by: item.so_luong, where: {id: item.id_sp}, transaction: t});
                    }
                }
            }
            if(donHang.id_km){
                await KhuyenMaiUser.destroy({
                    where: {
                        id_km: donHang.id_km,
                        id_dh: donHang.id,
                        id_user: donHang.id_user
                    },
                    transaction: t
                })
                //cộng lại số lượng voucher cho hệ thông
                await Voucher.increment('so_luong',{
                    by: 1,
                    where: {id: donHang.id_km},
                    transaction: t
                })
                // trừ đi số lượng da dung 
                await Voucher.decrement('da_dung',{
                    by: 1,
                    where: {id: donHang.id_km},
                    transaction:t 
                });
            }
        }
        //case 2 nếu  chuyển thành đơn hàng đã giao thì + đã bán 
        if(trang_thai_moi === DON_HANG_DA_GIAO_VALUE){
            const donHangItem = donHang.toJSON() as DonHangWithChiTiet;
            if(donHangItem.chi_tiet_dh){
                for(const  item of donHangItem.chi_tiet_dh){
                    await SanPham.increment('da_ban',{by: item.so_luong, where: {id: item.id_sp}, transaction: t});
                }
                
            }
            

        }
        
        //cặp nhật db 
        
        await t.commit();
        donHang.trang_thai_dh = trang_thai_moi
        try {
			const io = req.app.get('io');
            const template = thongBaoTemplate[noficationType.ADMIN_CHANGE_STATUS]
			const [newUserNotif, newShopNotif, newAdminNotif] = await Promise.all([
				
				ThongBao.create({
					id_user: donHang.id_user,
					tieu_de: noficationType.ADMIN_CHANGE_STATUS,
					noi_dung: template.content(donHang.ma_dh, donHang.trang_thai_dh),
					loai_thong_bao: LOAI_THONG_BAO.DON_HANG,
					id_tham_chieu: donHang.id,
					vai_tro_nhan: VAI_TRO_NHAN.PUBLIC,
					da_doc:  0
				}),
				ThongBao.create({
					id_user: donHang.id_shop,
					tieu_de: noficationType.ADMIN_CHANGE_STATUS,
					noi_dung: template.content(donHang.ma_dh, donHang.trang_thai_dh),
					loai_thong_bao: LOAI_THONG_BAO.DON_HANG,
					id_tham_chieu: donHang.id,
					vai_tro_nhan: VAI_TRO_NHAN.SHOP,
					da_doc:  0
				}),
				ThongBao.create({
					id_user: ADMIN_ROLE_ID,
					tieu_de: noficationType.ADMIN_CHANGE_STATUS,
					noi_dung:  template.content(donHang.ma_dh, donHang.trang_thai_dh) ,
					loai_thong_bao: LOAI_THONG_BAO.DON_HANG,
					id_tham_chieu: donHang.id,
					vai_tro_nhan: VAI_TRO_NHAN.ADMIN,
					da_doc:  0
				})
			]);
			io.to(buildRoom.user(donHang.id_user)).emit(SocketRoomName.notificationNew,newUserNotif.toJSON());
			io.to(buildRoom.shop(donHang.id_shop)).emit(SocketRoomName.notificationNew,newShopNotif.toJSON());
			io.to(buildRoom.admin()).emit(SocketRoomName.notificationNew,newAdminNotif.toJSON());
			
			logger.info(`[SOCKET] Đã bắn thông báo cập nhật đơn hàng ${donHang.id} `);
		} catch (socketError) {
			const err = socketError as CustomError;
			logger.error(`[SOCKET WARNING] Lỗi bắn thông báo cập nhật đơn hàng: ${err.message}`, { stack: err.stack });
		}
        return res.status(200).json({thong_bao: "Cập  nhật trạng thại dơn hàng thành công", success: true});
    } catch (error) {
        await t.rollback();
        const err = error as CustomError;
        const status = err.status || 500;
        const thong_bao = err.thong_bao || "Lỗi máy  chủ khi  thay đổi tình trạng đơn hàng";
        if(status >= 500){
            logger.error(`[CRITICAL] Lỗi APi(admin) thay đổi trạng  thái đơn hàng ${err.message || 'Unknown error'}`, {stack: err.stack || 'No stack trace'});
        }
        return res.status(status).json({thong_bao, success: false})
    }
})
router.get<{}, {}, {}, GetallDonHang>('/',async(req , res)=>{
    try {
        const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
        const limit = Number(req.query.limit) > 0 ? Number(req.query.limit) : 10;
        const offset = (page -1) * limit;
        const whereCondition: WhereOptions<DonHang> = {
            
        }
        if(req.query.trang_thai !== null && req.query.trang_thai !== undefined){
            const trang_thai = Number(req.query.trang_thai);
            if(!isNaN(trang_thai)){
                whereCondition.trang_thai_dh = trang_thai
            }
        }
        const {rows, count} = await DonHang.findAndCountAll({
            limit: limit,
            offset: offset,
            order: [['createdAt','DESC']],
            where: whereCondition,
            include: [{
                model: DonHangChiTiet,
                as: 'chi_tiet_dh',	
                attributes: ['id','id_dh','id_sp','id_bt','ten_sp','img','so_luong','gia','thanh_tien']
            },{
                model: User,
                as: 'shop',
                attributes: ['ten_shop','id','hinh']
            },{
                model: User,
                as: 'nguoi_mua',
                attributes: ['id','ho_ten','hinh']
            },{
                model: PTTT,
                as: 'pttt',
                attributes: ['ten_pt','code']
            }],
            distinct: true
        });
        const totalPages = Math.ceil(count / limit);
        const result = {
            data: rows,
            pagination: {
                currentPage: page,
                limit: limit,
                totalItem: count,
                totalPages: totalPages
            }
        }
        return res.status(200).json({result, success: true});
    } catch (error) {
        const err = error as CustomError;
        console.log(err.message);
        logger.error(`[CRITICAL] Lỗi APi(admin) danh sách đơn hàng ${err.message || 'Unknown error'}`, {stack: err.stack || 'No stack trace'});
        return res.status(500).json({thong_bao: "Lỗi máy chủ khi xem lịch sử đơn hàng", success: false});
    }
})
router.get<getDonHangDetailInput>('/:id',validate(getDonHangDetailSchema),async(req, res)=>{
	try {
		const {id} = req.params;
		
		const donHang = await DonHang.findOne({
			where: {
				id: id
			},
			include: [{
				model: DonHangChiTiet,
				as: 'chi_tiet_dh',
				attributes: ['id','ten_sp','img','so_luong','gia','thanh_tien','id_bt'],
			},{
				model: User,
				as:'shop',
				attributes: ['id','ten_shop','hinh']
			},{
                model: User,
                as: 'nguoi_mua',
                attributes: ['id','ho_ten','hinh']
            },{
				model: PTTT,
				as: 'pttt',
				attributes: ['ten_pt','code']
			},{
				model: Voucher,
				as: 'voucher',
				attributes: ['ten_km','code','loai_km','gia_tri_giam'],
				required: false//left join có voucher thì hiện ko thì thôi
			}]
		});
		if(!donHang){
			throw {status: 404, thong_bao: "Đơn hàng không tòn tại"};
		}
		return res.status(200).json({data: donHang, success: true});
	} catch (error) {
		const err = error as CustomError;
		console.log(err.message);
		const status = err.status ||500;
		const thong_bao = err.thong_bao || "Lỗi máy chủ khi xem chi tiết đơn hàng"
		if(status >= 500){
            logger.error(`[CRITICAL] Lỗi APi(admin) đơn hàng chi tiết ${err.message || 'Unknown error'}`, {stack: err.stack || 'No stack trace'});
        }
        return res.status(status).json({thong_bao, success: false});
	}
})


// Route: GET /api/admin/thong-ke/trang-thai-don-hang

export default router;