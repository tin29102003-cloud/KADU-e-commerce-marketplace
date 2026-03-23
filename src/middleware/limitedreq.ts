import rateLimit from "express-rate-limit"

export const resendLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,//15 phút
	max: 3,//cho phép 3 request từ 1 ip
	message: {
		
		thong_bao: "Bạn đã yêu cầu gửi lại quá nhiều lần. Vui lòng thử lại sau 15 phút.",
		success: false
	},
	standardHeaders: true, // để gửi header chuẩn http rare limit retry-after
	legacyHeaders: false//kiểu cũ nên  tắt

})
export const resendLimiterPaymentOnline = rateLimit({
	windowMs: 5 * 60 * 1000,
	max: 3,
	message : {
		thong_bao: "Bạn gửi yêu  cầu thanh toán qua nhiều lần vui  lòng thử lại sau 5 phút",
		success: false
	},
	standardHeaders: true,
	legacyHeaders: false
})
export const  otpVerifyLimiter = rateLimit({
	windowMs: 5 * 60 * 1000,//15 phút
	max: 2,//cho phép 3 request từ 1 ip
	message: {
		
		thong_bao: "Bạn đã yêu cầu gửi  OTP rồi. Vui lòng thử lại sau 5 phút.",
		success: false
	},
	standardHeaders: true, // để gửi header chuẩn http rare limit retry-after
	legacyHeaders: false//kiểu cũ nên  tắt
})
export const googleAuthLimiter = rateLimit({
	windowMs: 1 * 60 * 1000,
	max: 2,
	message: {
		thong_bao: "Bạn đã yêu cầu gửi mã xác thực 2 bước quá nhiều lần. Vui lòng thử lại sau 1 phút.",
		success: false
	},
	standardHeaders: true,
	legacyHeaders: false
})