class apiResponse {
  static success(res, data = null, message = "success", statusCode = 200) {
    res.status(statusCode).json({
      success: true,
      statusCode,
      data,
      message,
      timestamp: Date.now(),
    });
  }

  static error(
    res,
    message = "An error occurred",
    statusCode = 500,
    error = {}
  ) {
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      error,
      meta,
      timestamp: Date.now(),
    });
  }

  static created(res, data = null, message = "Resource created successfully") {
    return this.success(res, data, message, 201);
  }

  static badRequest(res, message = "Bad request", error = {}) {
    return this.error(res, message, 400, error);
  }

  static unauthorized(res, message = "Unauthorized", error = {}) {
    return this.error(res, message, 401, error);
  }

  static forbidden(res, message = "Forbidden", error = {}) {
    return this.error(res, message, 403, error);
  }

  static notFound(res, message = "Resource not found", error = {}) {
    return this.error(res, message, 404, error);
  }

  static validationError(res, message = "Validation error", error = {}) {
    return this.error(res, message, 422, error);
  }

  static serverError(res, message = "Internal server error", error = {}) {
    return this.error(res, message, 500, error);
  }
}
