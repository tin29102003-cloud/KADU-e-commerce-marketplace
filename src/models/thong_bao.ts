import { Model } from "sequelize";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../config/database";
class ThongBao  extends Model{
    public id!: number;
    public id_user!: number;
    public tieu_de!: string;
    public noi_dung!: string | null;
    public loai_thong_bao!: 'DON_HANG' | 'KHUYEN_MAI' | 'HE_THONG' | 'VOUCHER' | null;
    public id_tham_chieu!: number | null;
    public vai_tro_nhan!: number;
    public da_doc!: number;
}
ThongBao.init(
    {
        id: {type: DataType.INTEGER, autoIncrement: true, primaryKey: true},
        id_user: {type: DataType.INTEGER, allowNull: false},
        tieu_de: {type: DataType.STRING, allowNull: false,
            set(val){
                this.setDataValue('tieu_de', typeof val == 'string' ? val.trim() : val)
            }
        },
        noi_dung: {type: DataType.TEXT,
            set(val) {
                this.setDataValue('noi_dung', typeof val === 'string' ? val.trim() : val)
            },
        },
        loai_thong_bao: {type: DataType.ENUM('DON_HANG','KHUYEN_MAI','HE_THONG','VOUCHER')},
        id_tham_chieu: {type: DataType.INTEGER, allowNull: true},
        vai_tro_nhan: {type: DataType.TINYINT, defaultValue: 0},
        da_doc: {type: DataType.BOOLEAN, defaultValue: 0}

    },{
        sequelize,
        timestamps: true,
        updatedAt: false,
        tableName: 'thong_bao'
    }
)
export default ThongBao