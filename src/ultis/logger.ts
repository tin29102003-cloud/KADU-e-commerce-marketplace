import winston from "winston";
import 'winston-daily-rotate-file';
import morgan from 'morgan'
//câu hình cho file
const  logFormat = winston.format.combine(//cho phép kết hợp nhiều format lại
	//thêm thời giàn vao dòng log
	winston.format.timestamp({format: 'YYYY-MM--DD HH:mm:ss'}),
	//tùy chỉnh cách in ra màn hình level là múc đọ info error
	winston.format.printf((info)=>{
		const {timestamp, level , message, stack} = info;
		if(stack){
			return `[${timestamp}] ${level.toUpperCase()}: ${message}\n--- Chi tiết lỗi ---\n${stack}\n--------------------`;
		}
		return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
	})
);
//ccaus hinh nơi lưu trữ transports điểm đến của log
export const logger = winston.createLogger({
	level: 'info',//mực độ mặc định ghi nhận từ info trờ lên info warn err
	format: logFormat,//nd
	transports: [
		//điêm dến 1 in ra màn hình console
		new winston.transports.Console(),
		//điêm  lưu vào file tất cả mỗi log ghi chung
		new  winston.transports.DailyRotateFile({//nhớ imporrt dailu roatte file đê dung object daterole file
			dirname: 'logs',//ten thứ múc chưa file log
			filename: 'app-%DATE%.log',//tên file
			datePattern: 'YYYY-MM-DD',//cắt theo  ngày
			zippedArchive: true,//nén thành file zip  ngày hôm trước để nhẹ ổ cứng
			maxSize: '20m',//nếu log quá 20m tự xóa
			maxFiles: '14d' //tự dộng xóa fkile log cũ hơn 14 ngảy
		}),
		//diêm 3 lưu vào file rieng biệt cchir dành cho  lỗi để tìm bùg
		new winston.transports.DailyRotateFile({
			dirname: 'logs-error',
			level: 'error',
			filename: 'error-%DATE%.log',
			datePattern: 'YYYY-MM-DD',
			zippedArchive: true,
			maxSize: '20m',
			maxFiles: '30m'//lỗi giữ lại lâu hơn tí
		})
	]
})
//cấu hình morgan
//morgan khi có log ới thì nhét vào info của winston để log chui vào một fie
export const morganMiddleware = morgan(
	//chuỗi định dang morgon sẽ ghi phuong thuwcc get post put dele | dường dãn rồi status rồi thời gian phải hồi
	':method :url :status - :response-time ms',
	{
		//ghi dè luôn mặc định  của mỏgan
		stream: {
			//cứ mỗi khi morgan có tin mới sẽ gọi hàm wrrite này
			//dừng logger.info  để đây vào hệ thông winston
			write: (message) => logger.info(message.trim())
		}
	}
)

//nếu vậy thang info của winston so có kiểu dữ liêu này [2026-03-02 19:10:00] INFO: GET /api/tim-kiem-san-pham 500 - 150ms