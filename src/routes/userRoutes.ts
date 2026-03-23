import express, { Request, Response } from 'express';
import { AllowedUpdateUser, CreateUser, GetAllUser, UpdateUser, UserHinh, UserParams } from '../types/user';
import {ThongBao, User} from '../models';

import fs from 'fs';
import bcrypt from 'bcryptjs';
import { uploadMiddleware } from '../middleware/upload';
import { Op } from 'sequelize';
import { covertWebPathToAbsolutePath, processFilePath } from '../ultis/pathprocess';
import { ADMIN_ROLE_ID, Boolean_Type, LOAI_THONG_BAO, ROLE_MAP, VAI_TRO_NHAN } from '../config/explain';
import { normalizeBoolean } from '../ultis/validate';
import { logger } from '../ultis/logger';
import { CustomError } from '../types/appError';
import { buildRoom, SocketRoomName } from '../constants/socket-contants';
import { DisableTwoFactorInput, DisableTwoFactorSchema } from '../schema/user.schema';
import validate from '../middleware/validate';
import { AuthUser } from '../types/express';
import { noficationType, thongBaoTemplate } from '../constants/thong_bao';
const router = express.Router();

type MulterFieldFiles = {[fieldname: string]: Express.Multer.File[]};
router.get('/',async(req: Request<{}, {}, {}, GetAllUser>, res: Response)=>{
	try {
		const  page = req.query.page > 0  ? req.query.page : 1;
		const limit = req.query.limit > 0 ? req.query.limit : 10;
		const offset = (page -1) * limit;
		const  {rows, count} = await User.findAndCountAll({
			limit: limit,
			offset: offset,
			attributes: ['id','tai_khoan','email','mat_khau','ho_ten','ten_shop','vai_tro','hinh','provider','provider_id','khoa','dien_thoai','login_failed_count','last_login_fail','is_shop','createdAt'],
			order: [['createdAt','DESC']]
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
		return res.status(200).json({result});
	} catch (error) {
		const  err = error as CustomError
		logger.error(`[CRITICAL] Lỗi APi(admin)  lấy danh sách user ${err.message || 'Unknown error'}`, {stack: err.stack || 'No stack trace'});  
		return res.status(500).json({thong_bao: "Lỗi máy chủ khi lấy danh sách người dùng"});
	}
})
router.post('/',uploadMiddleware,async(req: Request<{}, {}, CreateUser>,res: Response)=>{
	let fileToClean: string[] = [];
	const cleanUpfiles = async()=>{
		await Promise.all(
			fileToClean.map((filePath)=>{
				return fs.promises.unlink(filePath).catch((error)=>{
					console.warn(` Cảnh báo: Không thể xóa tệp vật lý ${filePath}`, error.message);
					return Promise.resolve();
				});
			})
		);
	};

	try {
		const {tai_khoan, email, mat_khau, mat_khau_nhap_lai, ho_ten, vai_tro} = req.body;
		const files = req.files as  MulterFieldFiles;
		const newHinh = files?.['hinh_user']?.[0]?.path;
		if(newHinh) fileToClean.push(newHinh);

		const taiKhoanTrim = tai_khoan.trim();
		const emailTrim = email.trim();
		const hoTenTrim = ho_ten.trim();
		if(!taiKhoanTrim || !emailTrim || !mat_khau || !mat_khau_nhap_lai || !hoTenTrim){
			throw {status: 400, thong_bao: "Bạn chưa nhập đủ thông tin"};
		}
		if(vai_tro=== undefined  || vai_tro === null){
			throw {status: 400, thong_bao: "Bạn chưa chọn vai trò"};
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if(!emailRegex.test(emailTrim)){
			throw {status: 400, thong_bao: "Email chưa đúng định dạng"};
		}
		const hasUpperCase = /[A-Z]/;
		const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
		if(mat_khau.length < 8 || !hasUpperCase.test(mat_khau) || !hasSpecialChar.test(mat_khau)){
			throw {status: 400, thong_bao: "Mật khẩu phải trên 8 ký tự, có 1 chữ in hoa, 1 ký tự đặc biệt"}
		};
		if(mat_khau != mat_khau_nhap_lai){
			throw {status: 400, thong_bao: "Mật khẩu không trùng mật khẩu nhập lại"};
		}
		if(hoTenTrim.length < 8 ){
			throw {status: 400, thong_bao: "Họ và tên phải lớn hơn 8 ký tự"}
		}
		const allowedRole  = [0,1];//0 là người dung bình thường 1 là amin
		if(!allowedRole.includes(Number(vai_tro))){
			throw {status: 400, thong_bao: "Vai trò không hợp lệ"};
		}
		const existing  = await User.findOne({
			where: {[Op.or]: [{tai_khoan: taiKhoanTrim}, {email: emailTrim}]}
		});
		if(existing){
			if(existing.tai_khoan === taiKhoanTrim){
				throw {status: 409, thong_bao: "Tài khoản đã tồn tại, vui lòng Nhập tài khoản khác nhá"};
			}
			if(existing.email === emailTrim){
				throw {status: 409, thong_bao: "Email đã tồn tại, vui lòng nhập email khác"};
			}
		}
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(mat_khau, salt);
		const hinhPath = newHinh ? processFilePath(newHinh) : null;
		const newUser = await User.create({
			tai_khoan: taiKhoanTrim,
			email: emailTrim,
			mat_khau: hashedPassword,
			ho_ten: hoTenTrim,
			xac_thuc_email_luc: new Date(),
			hinh: hinhPath,
			vai_tro
		});
		//thanh cong trả magnr rỗng
		fileToClean = [];
		const role = ROLE_MAP[newUser.vai_tro];
		return res.status(200).json({thong_bao: ` Thêm thành công User có id là ${newUser.id} và role là ${role}` ,success: true});

	} catch (error) {
		await cleanUpfiles();
		const err= error as CustomError;

		const status = err.status || 500;
		const thong_bao = err.thong_bao || "Lỗi máy chủ khi thêm user";
		if(status >= 500){
			logger.error(`[CRITICAL] Lỗi APi(admin) thêm user ${err.message || 'Unknown error'}`, {stack: err.stack || 'No stack trace'});  
		}
		return res.status(status).json({thong_bao, success: false})
	}
})
router.get('/:id', async(req: Request<UserParams>, res: Response)=>{
	try {
		const {id} = req.params;
		if (isNaN(Number(id))) {
			 throw { status: 400, thong_bao: "ID người dùng không hợp lệ" };
		}
		const user = await User.findByPk(id,{
			attributes: [
				'id','tai_khoan','email','ho_ten','ten_shop','vai_tro','hinh','provider','khoa',
				'dien_thoai','xac_thuc_email_luc','is_shop','createdAt','updatedAt'
			]
		});
		if(!user){
			throw {status: 404, thong_bao: "Người dùng không tồn tại"};
		}
		res.status(200).json({user, success: true});
	} catch (error) {
		const err  = error as CustomError;
		const status = err.status || 500;
		const thong_bao = err.thong_bao || "Lỗi khi lấy 1 người dùng";
		if(status >= 500){
			logger.error(`[CRITICAL] Lỗi APi(admin) lấy chi tiết 1 user ${err.message || 'Unknown error'}`, {stack: err.stack || 'No stack trace'});  
		}
		return res.status(status).json({thong_bao, success: false})
	}
})
router.put<UserParams,{},UpdateUser>('/:id',uploadMiddleware ,async(req,res)=>{
	const fileToClean: string[] = [];
	const cleanUpfiles = async()=>{
		await Promise.all(
			fileToClean.map((filePath)=>{
				return fs.promises.unlink(filePath).catch((error)=>{
					console.warn(` Cảnh báo: Không thể xóa tệp vật lý ${filePath}`, error.message);
					return Promise.resolve();
				})
			})
		)
	}
	try {
		const {id} = req.params;
		const files = req.files as  MulterFieldFiles;
		const newHinh = files?.['hinh_user']?.[0]?.path;
		if(newHinh) fileToClean.push(newHinh);
		if (isNaN(Number(id))) {
			 throw { status: 400, thong_bao: "ID người dùng không hợp lệ" };
		}
		const {mat_khau, mat_khau_nhap_lai, ho_ten, dien_thoai, vai_tro, khoa} = req.body;
		const  user = await User.findByPk(id);
		if(!user){
			throw {status: 404, thong_bao: "Không tìm thấy user để cập nhật"};
		}
		
		const allowedUpdate: AllowedUpdateUser = {};
		const oldFileToDelete:string[] = [];
		const hoTenTrim = ho_ten?.trim();
		const dienThoaiTrim = dien_thoai?.trim();
		let shouldInvalidateToken = false;
		
		if(mat_khau){
			const hasUpperCase = /[A-Z]/;
			const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
			if(mat_khau.length < 8 || !hasUpperCase.test(mat_khau) || !hasSpecialChar.test(mat_khau)){
				throw {status: 400, thong_bao: "Mật  khẩu phải trên  8 ký tự, có 1 chữ in hoa và 1 ký tự đặc biệt"};
			}
			if(mat_khau != mat_khau_nhap_lai){
				throw {status: 400, thong_bao: "Mật khẩu không trùng mật khẩu nhập lại"};
			} 
			const salt = await  bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(mat_khau, salt);
			allowedUpdate.mat_khau = hashedPassword;
			shouldInvalidateToken = true;
		}
		if(hoTenTrim !== undefined && user.ho_ten !== hoTenTrim){
			allowedUpdate.ho_ten = hoTenTrim;
		}
		if(dienThoaiTrim !== undefined && user.dien_thoai !== dienThoaiTrim){
			if(isNaN(Number(dienThoaiTrim)) || dienThoaiTrim.length < 9){
				throw {status: 400, thong_bao: "Điện thoại phải là số và phải hơn 9 ký tự"};
			}
			allowedUpdate.dien_thoai = dienThoaiTrim;
		}
		if(vai_tro !== undefined){
			if(user.vai_tro !== Number(vai_tro)){
				const allowedRole = [0,1];
				
				if(!allowedRole.includes(Number(vai_tro))){
					throw {status: 400, thong_bao: "Vai Trò không hợp lệ"};
			}
			allowedUpdate.vai_tro = Number(vai_tro);
			shouldInvalidateToken = true;
		}
		}

		if(normalizeBoolean(user.khoa) !== normalizeBoolean(khoa)){
			allowedUpdate.khoa = normalizeBoolean(khoa);
			shouldInvalidateToken = true;
		}
		if(newHinh){
			allowedUpdate.hinh = processFilePath(newHinh);
			if(user.hinh){
				const oldAbsolutePath = covertWebPathToAbsolutePath(user.hinh);
				oldFileToDelete.push(oldAbsolutePath);
			}
		}
		if(shouldInvalidateToken){
			allowedUpdate.token_version = user.token_version + 1;
		}
		
		if(Object.keys(allowedUpdate).length > 0){
			await user.update(allowedUpdate);
			const updateUser = user.toJSON();
			await  Promise.all(oldFileToDelete.map((filePath)=>{
				return fs.promises.unlink(filePath).catch((error)=>{
					console.warn(` Cảnh báo: Không thể xóa tệp vật lý ${filePath}`, error.message);
					return Promise.resolve();
				})
			}))
			if(shouldInvalidateToken){
				try {
					const io = req.app.get('io');
					
					const userRoom = buildRoom.user(user.id)
					io.to(userRoom).emit(SocketRoomName.forceLogout,{
						thong_bao: "Thông tin của bạn đã được admin thay đổi vui lòng đăng nhập lại!"
					})
					io.in(userRoom).disconnectSockets(true);
					logger.info(`[SOCKET] Đã ngắt kết nối toàn bộ thiết bị của User ${user.id} do admin thay đổi thông tin.`);
				} catch (socketError) {
					const err = socketError as CustomError;
					logger.error(`[SOCKET WARNING] Lỗi bắn thông báo admin thay đổi thông tin: ${err.message}`, { stack: err.stack });
				}
			}
			return res.status(200).json({thong_bao: `Đã cập nhật user có ID là ${updateUser.id}`,success: true});
		}
		const  unUpdateUser =user.toJSON();
		
		
		return res.status(200).json({thong_bao: ` Không có cập nhật gì ở User có ID là ${unUpdateUser.id}`,success:true});
	} catch (error) {
		await cleanUpfiles();
		const err = error as  CustomError;

		const status = err.status || 500;
		const thong_bao = err.thong_bao || "Lỗi máy chủ khi cập nhật User";
		if(status >= 500){
			logger.error(`[CRITICAL] Lỗi APi(admin) phân quyền đổi mật khẩu user ${err.message || 'Unknown error'}`, {stack: err.stack || 'No stack trace'});  
		}
		return res.status(status).json({thong_bao, success: false});
	}
})
router.delete('/:id',async(req: Request<UserParams>, res: Response)=>{
	try {
		const {id} = req.params;
		if (isNaN(Number(id))) {
			 throw { status: 400, thong_bao: "ID người dùng không hợp lệ" };
		}
		const user = await User.findByPk(id);
		if(!user){
			throw {status: 404, thong_bao: "Người dùng không tồn tại nên không thể xóa"};
		}
		const fileToUnlink: string[] = [];
		if(user.hinh){
			fileToUnlink.push(user.hinh);
		}
		const  deletePromies = async()=>{
			await Promise.all(
				fileToUnlink.map((filePath)=>{
					const  absolutePath = covertWebPathToAbsolutePath(filePath);
					return fs.promises.unlink(absolutePath).catch((err)=>{
						console.warn(` Cảnh báo: Không thể xóa tệp vật lý ${filePath}`, err.message);
						return Promise.resolve();
					});
				})
			);
		};
		await deletePromies();
		await user.destroy();
		return res.status(200).json({thong_bao: "Đã xóa thành công user", success: true});
	} catch (error) {
		const err = error as CustomError;
		const status = err.status || 500;
		const thong_bao =err.thong_bao || "Lỗi máy chủ khi  xóa  user";
		if(status >= 500){
			logger.error(`[CRITICAL] Lỗi APi(admin) xóa user ${err.message || 'Unknown error'}`, {stack: err.stack || 'No stack trace'});  
		}
		return res.status(status).json({thong_bao,success: false});
	}
})
router.put<DisableTwoFactorInput['params'], {},DisableTwoFactorInput['body']>('/:id/disable-2fa',validate(DisableTwoFactorSchema),async(req, res)=> {
	try {
		const userPayLoad = req.user as  AuthUser;
		const id_user = userPayLoad.id;
		const {id} = req.params;
		const {ly_do} = req.body;
		const userTarget = await User.findByPk(id);
		if(!userTarget){
			throw {status: 404, thong_bao: "không tìm thấy người dùng này"};
		}
		if(!userTarget.is_2fa_enable){
			throw {status: 400, thong_bao: "Tài khoản chưa bật xác thực 2 bước"};
		}
		await userTarget.update({
			is_2fa_enable: Boolean_Type.false,
			two_fa_secret: null,
			otp: null,
			otp_expire: null,
		});
		logger.info(`[AUDIT_LOG_SECURITY] Admin ID:${id_user} đã TẮT 2FA cho User ID:${id}. Lý do: ${ly_do}`);
		try {
			const io = req.app.get('io');
			const template = thongBaoTemplate[noficationType.THAY_DOI_BAO_MAT];
			const templateAdmin = thongBaoTemplate[noficationType.LICH_SU_THAO_TAC];
			const [NewUserNotif, newAdminNotif] = await Promise.all([
				ThongBao.create({
					id_user: userTarget.id,
					tieu_de: noficationType.THAY_DOI_BAO_MAT,
					noi_dung: template.content(),
					loai_thong_bao: LOAI_THONG_BAO.HE_THONG,
					id_tham_chieu: userTarget.id,
					vai_tro_nhan: VAI_TRO_NHAN.PUBLIC,
					da_doc: Boolean_Type.false,
				}),
				ThongBao.create({
					id_user: ADMIN_ROLE_ID,
					tieu_de: noficationType.LICH_SU_THAO_TAC,
					noi_dung: templateAdmin.content(userTarget.email, ly_do),
					LOAI_THONG_BAO: LOAI_THONG_BAO.HE_THONG,
					id_tham_chieu: userTarget.id,
					vai_tro_nhan: VAI_TRO_NHAN.ADMIN,
					da_doc: Boolean_Type.false
				})
			]);
			io.to(buildRoom.user(userTarget.id)).emit(SocketRoomName.notificationNew, NewUserNotif.toJSON());
			io.to(buildRoom.admin()).emit(SocketRoomName.notificationNew, newAdminNotif.toJSON());
			logger.info(`[SOCKET & SECURITY] Admin ${id_user} đã tắt 2FA cho user ${userTarget.id}. Lý do: ${ly_do}`);
		} catch (socketError) {
			const err = socketError as CustomError;
			logger.error(`[SOCKET WARNING] Lỗi bắn thông báo tắt 2FA: ${err.message}`, { stack: err.stack });
		}
		return res.status(200).json({
			thong_bao: `đã tắt xác thực  2 bước cho người dùng ${userTarget.email}`,
			success: true
		})
	} catch (error) {
		const err = error as CustomError;
		const status = err.status || 500;
		const thong_bao = err.thong_bao || "Lỗi máy chủ tắt xác thực  2 bước";
		return res.status(status).json({thong_bao, success: false})
	}
})
export default router;