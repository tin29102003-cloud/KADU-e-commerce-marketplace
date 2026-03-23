import { Model } from "sequelize";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../config/database";
import { LOAI_HOI_THOAI } from "../constants/chat";

export class CuocHoiThoai extends Model{
    public id!: number; 
    public loai_hoi_thoai!: LOAI_HOI_THOAI.GROUP | LOAI_HOI_THOAI.ONE;
    public tin_nhan_cuoi!: string | null;
    public thoi_gian_cap_nhat!: string;
}
CuocHoiThoai.init({
    id: {type: DataType.INTEGER, primaryKey: true, autoIncrement: true},
    loai_hoi_thoai: {type: DataType.ENUM(LOAI_HOI_THOAI.GROUP , LOAI_HOI_THOAI.ONE), defaultValue: '1-1'},
    tin_nhan_cuoi: {type: DataType.TEXT, allowNull: true,
        set(val) {
            this.setDataValue('tin_nhan_cuoi', typeof val === 'string' ? val.trim() : val)
        },
    },
    thoi_gian_cap_nhat: {type: DataType.DATE, defaultValue: DataType.NOW},

},{
    sequelize,
    timestamps: true,

    tableName: 'cuoc_hoi_thoai',
})
