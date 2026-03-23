import { Op } from "sequelize";
import { sequelize } from "../config/database";
import { CuocHoiThoai, ThanhVienHoiThoai } from "../models";
import { LINE_MESSAGE, LOAI_HOI_THOAI, VAI_TRO_USER } from "../constants/chat";

export const  findOrCreateChatRoom = async(
    id_nguoi_gui: number,
    vai_tro_nguoi_gui: VAI_TRO_USER.ADMIN | VAI_TRO_USER.SHOP | VAI_TRO_USER.USER,
    id_nguoi_nhan: number,
    vai_tro_nguoi_nhan:VAI_TRO_USER.ADMIN | VAI_TRO_USER.SHOP | VAI_TRO_USER.USER
):Promise<{id_hoi_thoai: number; is_new: boolean}>=>{
    const t = await sequelize.transaction();
    try {
        //lấy dánh ssachs id phòng người gửi
        const  allMyRoom = await ThanhVienHoiThoai.findAll({
            where: {id_user: id_nguoi_gui, vai_tro: vai_tro_nguoi_gui},
            attributes: ['id_hoi_thoai'],
            transaction: t
        });
        const roomIdArr = allMyRoom.map(p => p.id_hoi_thoai);
        if(roomIdArr.length > 0){
            //tìm xem có phòng chung ko
            const  togetherRoom = await ThanhVienHoiThoai.findOne({
                where : {
                    id_hoi_thoai: {[Op.in]: roomIdArr},
                    id_user: id_nguoi_nhan,
                    vai_tro: vai_tro_nguoi_nhan
                },
                transaction: t
            })
            if(togetherRoom){
                await t.commit();
                return {id_hoi_thoai: togetherRoom.id_hoi_thoai, is_new: false};
            }
        }
        // ko có thì tạo phòng mới
        const newRoom = await CuocHoiThoai.create({
            loai_hoi_thoai: LOAI_HOI_THOAI.ONE,
            tin_nhan_cuoi: LINE_MESSAGE.FIRST,
            thoi_gian_cap_nhat: new Date()
        },{transaction: t});
        await ThanhVienHoiThoai.bulkCreate([
            {id_hoi_thoai: newRoom.id, id_user: id_nguoi_gui, vai_tro: vai_tro_nguoi_gui},
            {id_hoi_thoai: newRoom.id, id_user: id_nguoi_nhan, vai_tro: vai_tro_nguoi_nhan}
        ],{transaction: t});
        await t.commit();
        return {id_hoi_thoai: newRoom.id, is_new: true}
    } catch (error) {
        
        t.rollback();
        throw error;
    }
}