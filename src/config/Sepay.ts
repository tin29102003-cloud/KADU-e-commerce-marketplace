import { SePayPgClient } from 'sepay-pg-node';
if (!process.env.SEPAY_MERCHANT_ID || !process.env.SEPAY_SECRET_KEY) {
    throw new Error("Thiếu cấu hình PayOS trong file .env");
}
export const sepayClient = new SePayPgClient({
    env: 'sandbox',
    merchant_id: process.env.SEPAY_MERCHANT_ID,
    secret_key: process.env.SEPAY_SECRET_KEY
})