import crypto from 'crypto'
const  ALGORITHM = 'aes-256-gcm';//chỉ định thuật toán mẫ hóa ở đây là dùng khóa 256 = 32 type dùng thăng này tránh bị sửa dữ liệu
//bufter để lluw dữ liệu thô byte(aes-256): 32 byte iv cho  cbc: 16 byte nói cchung là buffter chuyên chuỗi thành byte

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY!,'hex');//cover key từ hẽ thành byte

const IV_LENGTH = 12//2 ký tự  hex = 1 byte //gcm dùng 12 byte
if (ENCRYPTION_KEY.length !== 32) {
  throw   new Error("Key phải 32 bytes");
}
export const encrypt = (text: string): string=>{
	//tạo ra một chuỗi 16 byte ngẫu nhiên cho mỗi lần mã hóa
	const iv = crypto.randomBytes(IV_LENGTH);
	//tạo cipher với thuật toán,key và iv
	const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
	//mã hóa phần đàu input utf8 output là hẽ
	let encrypted = cipher.update(text, 'utf8', 'hex');
	//mã hóa phần cuios nếu con block dỡ dang
	encrypted += cipher.final('hex');
	//gợp lại thành chuỗi hex bằng cacchs ghép iv đã chuyển về hex
	const authTag = cipher.getAuthTag();//với gcm lưu thêm authTag và quan trong nhat của gcm dùng verify xem dữ liệu có bị sửa ko
	return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;

}
//hàm giải mã một chuỗi
export const decrypt = (text: string): string=>{
	try {
		//tách dữ liệu ra  phần là phần iv và authtag và encrypdted
		const parts = text.split(':');
		if (parts.length !== 3) {//validate xem  có dủ 3 thành phần ko
			throw new Error("Dữ liệu không hợp lệ"); 
		}

		//lấy ra iv từ phần dầu đẻ giải mã
		const iv = Buffer.from(parts[0]!, 'hex');//cover là từ hẽ -> buffer
		const authTag = Buffer.from(parts[1]!, 'hex');
		
		//llaay cipertext
		const encryptedText = parts[2]!;
		//tạo decipher để giải  mã
		const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
		//giải mẫ 
		decipher.setAuthTag(authTag);//validate xem dữ liệu  có bị sưar
		let decrypted = decipher.update(encryptedText, 'hex','utf8');//giải mã phần đầu
		decrypted += decipher.final('utf8');//giải mã phần cuoios + verify authtag
		return decrypted;//trả về palin text
	} catch (error) {
		console.warn("Giải mã thất bại:", error);
		throw new Error("Dữ liệu ko hợp lệ")
	}
}
