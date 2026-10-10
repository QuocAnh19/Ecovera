class ApiResponse {
  static success(res, data = null, message = "Thành công", statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created(res, data = null, message = "Tạo mới thành công") {
    return this.success(res, data, message, 201);
  }
}

export default ApiResponse;
export { ApiResponse };
