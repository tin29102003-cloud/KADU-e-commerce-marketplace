import {z} from 'zod';
export const updateUserSchema = z.object({
    body: z.object({
        ho_ten: z.string().trim().min(5, "Họ và tên không được dưới 5 ký  tự"),
        dien_thoai: z.string().trim().min(9, "số điện thoại không được dưới 9 ký tự")
    })
})
export const UpdatePinSchema = z.object({
    body: z.object({
        ma_pin_moi: z.string()
            .min(1,"Mã pin không được để trống")
            .regex(/^\d{4}$/,"mã bảo vệ không được dưới 4 ký tự và phải là số")
    })
})
export const SetupTwoFactorSchema = z.object({
    body: z.object({
        mat_khau: z.string()
            .min(1,"Mật  khẩu không được để trống")
    })
})
export const verifyTwoFactorSchema = z.object({
    body: z.object({
        ma_bao_ve: z.string().length(6, "Mã bảo vệ phải đúng 6 ký tự").regex(/^\d+$/,"Mã bảo vệ chỉ được chứa số").trim()
    })
})
export const OtpSchema = z.object({
    body: z.object({
        otp: z.string().length(6, "Otp phải đúng 6 ký tự").regex(/^\d+$/,"Mã bảo vệ chỉ được chứa số").trim()
    })
})
const paramsIdUser = z.object({
    id: z.string().regex(/^\d+$/, "ID giỏ  hàng phải là số")
})
export const  DisableTwoFactorSchema = z.object({
    params:paramsIdUser,
    body: z.object({
        ly_do: z.string().min(5,"Lý do khong dưới 5 ký tự").max(255,"Lý do khong quá 255 ký tự").trim()
    })
})
export type DisableTwoFactorInput = z.infer<typeof DisableTwoFactorSchema>
export type OtpInPut = z.infer<typeof OtpSchema>['body'];
export type verifyTwoFactorInput = z.infer<typeof verifyTwoFactorSchema>['body'];
export type SetupTwoFactorInput = z.infer<typeof SetupTwoFactorSchema>['body'];
export type UpdatePinInput = z.infer<typeof UpdatePinSchema>['body'];
export type updateUserInput = z.infer<typeof updateUserSchema>['body'];