import { Model } from "sequelize";

import { DataType } from "sequelize-typescript";
import { sequelize } from "../config/database";
import { VAI_TRO_USER } from "../constants/chat";
export class ThanhVienHoiThoai extends Model{
    public id!: number;
    public id_hoi_thoai!: number;
    public id_user!: number;
    public vai_tro!: VAI_TRO_USER.ADMIN | VAI_TRO_USER.SHOP | VAI_TRO_USER.USER;
    public an_hien!: number;
}
ThanhVienHoiThoai.init({
    id : {type: DataType.INTEGER, primaryKey: true, autoIncrement: true},
    id_hoi_thoai: {type: DataType.INTEGER, allowNull: false},
    id_user: {type: DataType.INTEGER, allowNull: false},
    vai_tro: {type: DataType.ENUM(VAI_TRO_USER.ADMIN, VAI_TRO_USER.SHOP, VAI_TRO_USER.USER), allowNull: false},
    an_hien: {type: DataType.BOOLEAN, defaultValue: 1}
},{
    sequelize,
    timestamps: true,
    updatedAt: false,
    tableName: 'thanh_vien_hoi_thoai'
})