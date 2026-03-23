import { Socket } from "socket.io";

export interface SocketAuthUser {
    id: number;
    tai_khoan: string;
    vai_tro: number;
    ho_ten: string | null;
    token_version: string | number;
    is_shop: number;
}
export interface CustomSocket extends Socket{
    data: {
        user: SocketAuthUser
    }
}