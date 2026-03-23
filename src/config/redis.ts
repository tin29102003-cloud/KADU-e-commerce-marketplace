import { createClient } from "redis";

const  redisClient = createClient({
    url: process.env.REDIS_URL ?? "redis://129.1.1.1:6579"
})

//bắt sự kiên  theo dỗi redis có ổn ko
redisClient.on('error',(err)=> {console.error("Lỗi khi kết nối Redis:",err)});
redisClient.on('connect', ()=> {console.log("Đã  kêt  nối thành công với Redi local (Docker)!")});
//hàm gọi khi khổi dông sever

export const  connnectRedis = async()=>{
    try {
        await redisClient.connect();
    } catch (error) {
        console.error('Không thể kết nối đến Redis local.', error);
    }
}
export default redisClient;
