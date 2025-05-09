class AppError extends Error {
    /**
     * 
     * @param {string} message - Thông báo lỗi (hiển thị cho người dùng)
     * @param {number} statusCode - HTTP status code (mặc định: 400)
     * @param {string} code - Mã lỗi nội bộ (ví dụ: PROMPT_NOT_FOUND)
     */
    constructor(message, statusCode = 400, code = '') {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.name = 'AppError';
        Error.captureStackTrace(this, this.constructor);
    }
}
  
module.exports = AppError;
  