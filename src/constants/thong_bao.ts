export enum noficationType {
    UPDATE_DH_SHOP = "Cập  nhật đơn hàng!",
    ADMIN_UPDATE_DH_SHOP = "Shop Cập nhất đơn hàng",
    DON_HANG_MOI = "Đơn hàng mới!",
    DAT_HANG_THANH_CONG = "Đặt hàng thành công",
    SHOP_HUY_DON_HANG = "Shop hủy đơn hàng",
    SHOP_HUY_DON_HANG_SHOP = "Bạn đã hủy đơn hàng",
    ADMIN_CHANGE_STATUS = "Cập nhật trạng thái đơn hàng",
    YEU_CAU_RUT_TIEN = "Yêu cầu rút tiền mới",
    XAC_NHAN_RUT_TIEN_SUCCESS = "Rút tiền thành công",
    XAC_NHAN_RUT_TIEN_REJECT = "Yêu cầu rút tiền bị từ chối",
    THAY_DOI_BAO_MAT = "Thay đổi bảo mật",
    LICH_SU_THAO_TAC = "Lịch sử thao  tác"
}
export const STATUS_MAP: Record<number, string> = {
    0: 'chờ xác nhận',
    1: 'shop chuẩn bị hàng',
    2: 'đang giao',
    3: 'giao hàng thành công'
}
const STATUS_MONEY: Record<number, string> = {
    0: 'chờ xác nhận',
    1: 'Thành công',
    2: 'Thất bại'
}
export const  thongBaoTemplate = {
    [noficationType.UPDATE_DH_SHOP]: {
        content: (orderId: string, status: keyof typeof STATUS_MAP)=>
             `Đơn hàng ${orderId} của bạn vừa được Shop cập nhật sang trạng thái: ${STATUS_MAP[status]}.`
        
    },
    [noficationType.ADMIN_UPDATE_DH_SHOP]:{
        content: (shopId: number, orderId: string)=>
                `Đơn  hàng ${orderId} của shop có  ID ${shopId} vừa đc cập nhật trạng thái, admin vui  lòng theo dõi để cập nhật trạng thái cho đơn hàng`
    },
    [noficationType.DON_HANG_MOI]:{
        content:(orderTamTinh:number)=>
            `Bạn vừa nhận được một đơn hàng mới trị giá ${orderTamTinh.toLocaleString()}đ`
    },
    [noficationType.DAT_HANG_THANH_CONG]:{
        content:(OrderLength:{
            shopId: number;
            orderId: number;
            tam_tinh: number;
        }[])=>
            `Bạn vừa đặt thành công ${OrderLength.length} đơn hàng. Các shop đang chuẩn bị hàng cho bạn nhé!`
    },
    [noficationType.ADMIN_CHANGE_STATUS]: {
        content: (orderId: string, status: keyof typeof STATUS_MAP)=>
             `Đã cập nhật trạng thái đơn hàng ${orderId} sang trạng thái: ${STATUS_MAP[status]}.`
        
    },
    [noficationType.YEU_CAU_RUT_TIEN]: {
        content: (id_shop: number, so_tien: number)=>
             `Shop (ID: ${id_shop}) vừa tạo yêu cầu rút ${so_tien.toLocaleString('vi-VN')}đ.`
        
    },
    [noficationType.XAC_NHAN_RUT_TIEN_SUCCESS]: {
        content: (id_yc: number, so_tien: number,)=>
             `Yêu cầu rút ${so_tien.toLocaleString('vi-VN')}đ (Mã: #${id_yc}) đã được giải ngân. Tiền sẽ về tài khoản ngân hàng của bạn trong thời gian sớm nhất.`
        
    },
    [noficationType.XAC_NHAN_RUT_TIEN_REJECT]: {
        content: (id_yc: number, so_tien: number,ly_do: string | undefined)=>
             `Yêu cầu rút ${so_tien.toLocaleString('vi-VN')}đ (Mã: #${id_yc}) bị từ chối. Lý do: ${ly_do || 'Không hợp lệ'}. Số tiền đã được hoàn lại vào Ví của bạn.`
        
    },
    [noficationType.THAY_DOI_BAO_MAT]: {
        content: ()=>
            `Quản trị viên đã TẮT tính năng Xác thực 2 bước (2FA) trên tài khoản của bạn theo yêu cầu.`
    },
    [noficationType.LICH_SU_THAO_TAC]: {
        content: (email: string, ly_do: string)=>
            `Bạn vừa gỡ 2FA cho người dùng ${email }. Lý do: ${ly_do}`
    }
}