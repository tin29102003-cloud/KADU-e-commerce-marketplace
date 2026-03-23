
import z from "zod";
import { VAI_TRO_USER } from "../constants/chat";
export const CHAT_ROLE_MAP = {
    [VAI_TRO_USER.USER]: [VAI_TRO_USER.ADMIN, VAI_TRO_USER.SHOP],
    [VAI_TRO_USER.ADMIN]: [VAI_TRO_USER.SHOP, VAI_TRO_USER.USER],
    [VAI_TRO_USER.SHOP]: [VAI_TRO_USER.USER, VAI_TRO_USER.ADMIN]
} as const;
export const UserChatSchema = z.object({
    body: z.object({
        id_nguoi_nhan: z.coerce.number().int().positive("ID người dùng không hợp lệ"),
        vai_tro_nguoi_nhan: z.enum(CHAT_ROLE_MAP[VAI_TRO_USER.USER], {message: "Vai trò không hợp lệ vui lòng thử lại!"})
    })
    
})
export const ShopChatSchema = z.object({
    body: z.object({
        id_nguoi_nhan:  z.coerce.number().int().positive("Id người dùng không hợp lệ"),
        vai_tro_nguoi_nhan: z.enum(CHAT_ROLE_MAP[VAI_TRO_USER.SHOP], {message: "Vai trò không hợp lệ vui lòng thử lại"})
    })
})
export const AdminChatSchema = z.object({
    body: z.object({
        id_nguoi_nhan:  z.coerce.number().int().positive("Id người dùng không hợp lệ"),
        vai_tro_nguoi_nhan: z.enum(CHAT_ROLE_MAP[VAI_TRO_USER.ADMIN], {message: "Vai trò không hợp lệ vui lòng thử lại"})
    })
})
export const GetAllChatSchema = z.object({
    params: z.object({
        id_hoi_thoai: z.string().regex(/^\d+$/, "ID hội thoại phải là số")
    })
})
export const  ReadAllChatSchema = z.object({
    body: z.object({ id_hoi_thoai: z.coerce.number().int().positive("Id cuộc hội  thoai không hợp lệ"),
    })

    
})
export const  IsHideCoverstationSchema = z.object({
    body: z.object({ id_thanh_vien: z.coerce.number().int().positive("Id cuộc hội  thoai không hợp lệ"),
    })

    
})
export const  RecallMessageSchema = z.object({
    body: z.object({ id_tin_nhan: z.coerce.number().int().positive("Id cuộc hội  thoai không hợp lệ"),
    })

    
})

export const SendChatSchema = z.object({
    body: z.object({
        id_hoi_thoai: z.coerce.number().int().positive("Id người dùng không hợp lệ"),
        noi_dung: z.string().min(1,"Nội dung tối thiểu phải chứa 1 ký tự")
        .max(1000,"Nội dung tối đa là 1000 ký tự")
    })
})
export const ReadHiddenConversationSchema = z.object({
    body: z.object({
        ma_pin: z.string()
            .min(1,"Mã pin không được để trống")
            .regex(/^\d{4}$/,"mã bảo vệ không được dưới 4 ký tự và phải là số")
    })
})
export type IsHideCoverstationInput = z.infer<typeof IsHideCoverstationSchema>['body'];
export type RecallMessageInput = z.infer<typeof RecallMessageSchema>['body'];
export type ReadHiddenConversationInput = z.infer<typeof ReadHiddenConversationSchema>['body'];
export type ReadAllChatInput = z.infer<typeof ReadAllChatSchema>['body'];
export type SendChatInput = z.infer<typeof SendChatSchema>['body'];
export type GetAllChatInput = z.infer<typeof GetAllChatSchema>['params'];
export type UserChatSInput = z.infer<typeof UserChatSchema>['body'];
export type ShopChatSInput = z.infer<typeof ShopChatSchema>['body'];
export type AdminChatSInput = z.infer<typeof AdminChatSchema>['body'];