import { Op } from "sequelize";

import { GetAllChuaThanhToan } from "../types/thanhtoan";
import express from 'express';
import { CHAP_NHAN_RUT_TIEN, CHO_XAC_NHAN_RT, LOAI_THONG_BAO, THANH_TOAN_THANH_CONG_VALUE, VAI_TRO_NHAN } from "../config/explain";

import { DonHang, DonHangChiTiet, PTTT, ThongBao, User, ViShop, YeuCauRutTien } from "../models";
import { ParamsThanhToanIdInput, ParamsThanhToanIdSchema, XyLyRutTienInput, XyLyRutTienSchema } from "../schema/thanhtoan.shema";
import validate from "../middleware/validate";

import { sequelize } from "../config/database";
import { logger } from "../ultis/logger";
import { CustomError } from "../types/appError";
import { noficationType, thongBaoTemplate } from "../constants/thong_bao";
import { buildRoom, SocketRoomName } from "../constants/socket-contants";
const router  =express.Router();

router.get<{},{},{},GetAllChuaThanhToan>('/xac-nhan-thu-cong',async(req, res)=>{
    try {
        const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
        const limit = Number(req.query.limit) > 0 ? Number(req.query.limit) : 10;
        const offset = (page -1) * limit; 
        const {rows, count} = await DonHang.findAndCountAll({
            limit: limit,
            offset: offset,
            order: [['createdAt','DESC']],
            where: {trang_thai_thanh_toan: {[Op.ne]: THANH_TOAN_THANH_CONG_VALUE} },
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
        logger.error(`[CRITICAL] Lỗi APi(admin) lấy danh sách đơn hàng chờ xác thực đã thanh toán chưa ${err.message || 'Unknown error'}`, {stack: err.stack || 'No stack trace'});
        return res.status(500).json({thong_bao: "Lỗi máy chủ khi xem lịch sử đơn hàng", success: false});
    }
})
//api chống cháy dành cho admin nếu  khách hàng đã thanh toán tiền vào túi nhưng api ko cập nhật trạng thái thanh toán thì admin phải caapja nhật thủ công
router.put<ParamsThanhToanIdInput>('/xac-nhan-thu-cong/:id',validate(ParamsThanhToanIdSchema),async(req, res)=>{
    try {
        const {id} = req.params;
        const donHang = await DonHang.findByPk(id);
        if(!donHang){
            throw {status: 404, thong_bao: "Đơn  hàng không tồn tại"};
        }
        await donHang.update({trang_thai_thanh_toan: THANH_TOAN_THANH_CONG_VALUE});
        return res.status(200).json({thong_bao: "Đã cập nhật trạng thái thanh toán thành công",success: true});
    } catch (error) {
        const err = error as CustomError;
        const status = err.status || 500;
        const thong_bao = err.thong_bao || "Lỗi máy chủ khi cập nhạt trạng thái thanh toán"
        if(status >= 500){
             logger.error(`[CRITICAL] Lỗi APi(admin) cập nhật đơn hàng bị lỗi thanh toán online ${err.message || 'Unknown error'}`, {stack: err.stack || 'No stack trace'});
        }
        return res.status(status).json({thong_bao, success: false});
    }
})
//xử lý yêu  cầu rút tiền cho shop
router.get<{},{},{}, GetAllChuaThanhToan>('/yeu-cau-rut-tien/pending',async(req , res)=>{
    try {
        const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
        const limit = Number(req.query.limit) > 0 ? Number(req.query.limit) : 10;
        const offset = (page -1) * limit; 
        const {rows, count} = await YeuCauRutTien.findAndCountAll({
            where:{
                trang_thai: CHO_XAC_NHAN_RT
            },
            offset: offset,
            limit: limit,
            include: [{
                model: User,
                as: 'shop',
                attributes: ['ten_shop','email','id','hinh']
            }],
            order: [['createdAt','DESC']]
        })
        const totalPages = Math.ceil(count / limit);
        const result = {
            data: rows,
            pagination: {
                currentPage: page,
                limit: limit,
                totalItem : count,
                totalPages: totalPages
            }
        }
        return res.status(200).json({result, success: true});
    } catch (error) {
        const err  =error as CustomError;

        logger.error(`[CRITICAL] Lỗi APi(admin) danh sách yêu cầu rút tiền của shop ${err.message || 'Unknown error'}`, {stack: err.stack || 'No stack trace'});

        return res.status(500).json({thong_bao: "Lỗi máy chủ khi lấy danh  sách yêu cầu rút tiền"});
    }
})
//api lấy 1 cái ra dể cho  trả về mã qr để quét chuyền tiền cho  shop
router.get<ParamsThanhToanIdInput>('/yeu-cau-rut-tien/:id',validate(ParamsThanhToanIdSchema),async(req , res)=>{
    try {
        const {id} = req.params;
        const yeuCau = await YeuCauRutTien.findByPk(id,{
            include: [{
                model: User,
                as: 'shop',
                attributes: ['ten_shop', 'email', 'hinh']
            }]
        });
        if(!yeuCau){
            throw {status: 404, thong_bao: 'Yêu cầu rút tiền không tồn tại'};
        }
        const bankCode = yeuCau.ten_ngan_hang;
        const bankAcc = yeuCau.so_tk;
        const amount = yeuCau.so_tien;
        //encode uri để xử lý các ký tự đăc biệt  hoặc dấu cách trong nội dung
        const content = encodeURIComponent(`Shop ${yeuCau.id_shop} rut tien don ${yeuCau.id}`);
        const qrLink = `https://img.vietqr.io/image/${bankCode}-${bankAcc}-compact.png?amount=${amount}&addInfo=${content}`;
        return res.status(200).json({
            data: {
                ...yeuCau.toJSON(),
                qr_link: qrLink
            }
        });

    } catch (error) {
        const err = error as  CustomError;
        const status = err.status || 500;
        const thong_bao = err.thong_bao || "LỖi may cchur khi lấy chi tiết yêu cầu rút  tiền";
        logger.error(`[CRITICAL] Lỗi APi(admin) chi tiết yêu cầu rút tiền của shop ${err.message || 'Unknown error'}`, {stack: err.stack || 'No stack trace'});
        return res.status(status).json({thong_bao, success: false});
    }
})
//api xet duyệt từ chối chuyền tiền
router.put<XyLyRutTienInput['params'],{}, XyLyRutTienInput['body']>('/yeu-cau-rut-tien/:id',validate(XyLyRutTienSchema),async(req , res)=>{
    const t = await sequelize.transaction();
    try {
        const {id} = req.params;
        const {trang_thai, ly_do} = req.body;
        const yeuCau = await YeuCauRutTien.findByPk(id,{transaction: t});
        if(!yeuCau){
            throw {status: 404, thong_bao: "Yêu cầu rút tiền không tồn tại"};
        }
        if(yeuCau.trang_thai !== 0){
            throw {status: 400, thong_bao :"Yêu cầu này đã đc xử lý rồi"};
        }
        const viShop = await ViShop.findOne({
            where: {id_shop: yeuCau.id_shop},
            transaction: t
        })
        if(!viShop){
            throw {status: 400, thong_bao: 'Lỗi dữ liệu: Ví shop  không tồn tại'};
        }
        if(trang_thai === CHAP_NHAN_RUT_TIEN){
            await viShop.increment('tong_da_rut',{
                by: Number(yeuCau.so_tien),
                transaction: t
            });
            await yeuCau.update({
                trang_thai: trang_thai,
                ngay_xu_ly: new Date()
            },{transaction: t});
        }else{
            await viShop.increment('so_du',{
                by: Number(yeuCau.so_tien),
                transaction: t
            });
            await yeuCau.update({
                trang_thai: trang_thai,
                ly_do: ly_do|| "Yêu cầu bị từ chối và đã hoàn tiền số dư cho shop",
                ngay_xu_ly: new Date()
            },{transaction: t});
        }
        await t.commit();
         const isSuccess = trang_thai === CHAP_NHAN_RUT_TIEN;
        try {
			const io = req.app.get('io');
           
            const template = isSuccess ? thongBaoTemplate[noficationType.XAC_NHAN_RUT_TIEN_SUCCESS].content(yeuCau.id,yeuCau.so_tien) : thongBaoTemplate[noficationType.XAC_NHAN_RUT_TIEN_REJECT].content(yeuCau.id,yeuCau.so_tien,ly_do);
			const newShopNotif = await ThongBao.create({
				id_user: viShop.id_shop,
				tieu_de: isSuccess ? noficationType.XAC_NHAN_RUT_TIEN_SUCCESS : noficationType.XAC_NHAN_RUT_TIEN_REJECT,
				noi_dung: template,
				loai_thong_bao: LOAI_THONG_BAO.HE_THONG,
				id_tham_chieu: yeuCau.id,
				vai_tro_nhan: VAI_TRO_NHAN.SHOP,
				da_doc: 0
			});
			io.to(buildRoom.shop(viShop.id_shop)).emit(SocketRoomName.notificationNew, newShopNotif.toJSON());
			logger.info(`[SOCKET] Đã bắn thông báo yêu cầu xác nhận rút tiền ID ${yeuCau.id} cho Shop`);
		} catch (socketError) {
			const err = socketError as CustomError;
            logger.error(`[SOCKET WARNING] Lỗi bắn thông báo rút tiền cho Shop: ${err.message}`, { stack: err.stack });
		}
        return res.status(200).json({
            thong_bao: isSuccess ? "Đã duyệt yêu cầu thành công" : "Đã từ chối và hoàn tiền cho Shop",
            success: true
        })
    } catch (error) {
        await t.rollback();
        const err = error as  CustomError;
        
        const status = err.status || 500;
        const thong_bao = err.thong_bao || "Lỗi máy chủ khi  xử lý rút tiền";
        if(status >= 500){
			logger.error(`[CRITICAL] Lỗi APi xử lý yêu cầu rút tiền của shop ${err.message || 'Unknown error'}`, {stack: err.stack || 'No stack trace'});
		}
        return res.status(status).json({thong_bao, success: false})
    }
})
export default router