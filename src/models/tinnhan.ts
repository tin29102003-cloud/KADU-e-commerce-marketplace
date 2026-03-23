import { Model } from "sequelize";

import { sequelize } from "../config/database";
import { DataType } from "sequelize-typescript";
import { VAI_TRO_USER } from "../constants/chat";
export class TinNhan extends Model{
    public id!: number;
    public id_hoi_thoai!: number;
    public id_user!: number | null;
    public vai_tro!: VAI_TRO_USER.ADMIN | VAI_TRO_USER.USER | VAI_TRO_USER.SHOP;
    public noi_dung!: string | null;
    public da_doc!: number;
    public is_recalled!: number;
    public createdAt!: Date;
}
TinNhan.init({
    id: {type: DataType.INTEGER, primaryKey: true, autoIncrement: true},
    id_hoi_thoai: {type: DataType.INTEGER, allowNull: false},
    id_user: {type: DataType.INTEGER, allowNull: true},
    vai_tro: {type: DataType.ENUM(VAI_TRO_USER.ADMIN, VAI_TRO_USER.USER, VAI_TRO_USER.SHOP), allowNull: false},
    noi_dung: {type: DataType.TEXT, allowNull: true,
        set(val) {
            this.setDataValue('noi_dung', typeof val === 'string' ? val.trim() : val)
        },
    },
    da_doc: {type: DataType.BOOLEAN, defaultValue: 0},
    is_recalled : {type: DataType.BOOLEAN, defaultValue: 0}
},{
    sequelize,
    timestamps: true,
    tableName: 'tin_nhan',
    
})