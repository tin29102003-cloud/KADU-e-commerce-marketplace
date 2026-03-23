import { ParsedQs } from "qs";

export interface ThanhToanBody{
    orderCode: number;
    amount: number;
    description: string;
    cancelUrl: string;
    returnUrl: string;
    expiredAt: number;
}
export interface PayOsWebhookData{
    orderCode: number;
    amount: number;
    description: string;
    accountNumber: string;
    reference: string;
    transactionDateTime: string;
    currency: string;
    paymentLinkId: string;
    code: string
}
export interface PayOswebhookPayLoad<T>{
    code: string;
    desc?: string;
    data: T;
    signature: string;
}
export interface GetAllChuaThanhToan extends ParsedQs{

    page: string;
    limit: string;
}
export interface SePayPGWebhookPayload {
    notification_type: string;
    order: {
        order_invoice_number: string; 
        order_amount: string;         
        order_status: string;        
        order_description: string;
    };
    transaction: {
        transaction_status: string;   
        transaction_amount: string;   
    };
    // ... có thể có thêm các trường khác nhưng đây là core
}