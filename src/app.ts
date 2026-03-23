import express from "express";
import './config/passport';

import { adminAuth } from "./middleware/auth";

import AuthRouter from "./routes/authRoutes";
import UserRouter from  "./routes/userRoutes";
import SiteRouter from './routes/siteRoutes';
import DMSPRouter from './routes/dm_spRouter';
import ThuongHieuSpRouter from './routes/thuonghieu';
import DMTinRouter from './routes/dm_tinRoutes';
import TinTucRouter from './routes/tintucRouter';
import BannerRouter from './routes/bannerRouter';
import ThuocTinhRouter from './routes/thuoctinhrouter';
import SanPhamRouter from './routes/sanphamRouter';
import PTTTRouter from './routes/ptttRoutes';
import VoucherRouter from './routes/voucherRoutes';
import DonHangRouter from './routes/donhangRoutes';
import ThanhToanRouter from './routes/thanhtoanRouter';
import ThongKeRouter from './routes/thong_keRoutes';
import ThongBaoRouter from './routes/thongbaoRouter'
import ChatRouter from './routes/chatRouter';

import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import setupSwagger from "./swagger";
import { morganMiddleware } from "./ultis/logger";
const app = express();
app.use(cookieParser());
app.use(cors({
    credentials: true,// cho phép gửi coookie
    origin: process.env.CLENT|| "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
}))
app.use(express.json());
app.use(express.static("public"));


app.use(passport.initialize());//để passpord dùng đc trong express

///router viêt dưới đây
app.use(morganMiddleware);
app.use('/',AuthRouter);
app.use('/api/site',SiteRouter);
app.use('/api/admin', adminAuth);
app.use('/api/admin/user', UserRouter)
app.use('/api/admin/danh-muc-sp', DMSPRouter);
app.use('/api/admin/thuong-hieu-sp',ThuongHieuSpRouter);
app.use('/api/admin/danh-muc-tin', DMTinRouter)
app.use('/api/admin/tin-tuc',TinTucRouter);
app.use('/api/admin/banner',BannerRouter);
app.use('/api/admin/thuoc-tinh-sp', ThuocTinhRouter);
app.use('/api/admin/san-pham', SanPhamRouter);
app.use('/api/admin/pttt',PTTTRouter);
app.use('/api/admin/voucher', VoucherRouter);
app.use('/api/admin/don-hang', DonHangRouter);
app.use('/api/admin/thanh-toan',ThanhToanRouter);
app.use('/api/admin/thong-ke',ThongKeRouter);
app.use('/api/admin/thong-bao',ThongBaoRouter);
app.use('/api/admin/chat', ChatRouter);
setupSwagger(app);
export default app;