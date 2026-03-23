
import app from "./app";
import { sequelize } from "./config/database";
import { connnectRedis } from "./config/redis";
import http from "http";
import './job/autoComfirm';
import { setupSocket } from "./socket";
//vì job nên start khi server cần start
const port = process.env.PORT || 6000;
export const startServer = async()=>{
    try {
        await sequelize.authenticate();
        await connnectRedis();
        console.log("kêt nối cơ sở dữ liệu  thành công");
        // await sequelize.sync({alter: true});//chayj lenh khi tao model va fiel index
        const server = http.createServer(app);
        setupSocket(server, app);

        server.listen(port, ()=>{
            console.log(`server + socket.io đang chạy tại  cổng: ${port}`);
        })
        .on('error',function(err){
            console.log('lỗi xảy ra khi  chạy ứng dụng',err.message);
        })
    } catch (err:any) {
        console.log('kết nối cơ  sở dữ liệu thất bại :',err.message);
        process.exit(1);//dừng app nếu db bị lỗi
    }
};