export const errorHandler = (err, req, res, next) => {
  console.error("Error:", {
    message: err.message,
    stack: err.stack,
    originalError: err.originalError,
  });

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? "Server Error" : err.message;

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      details: err.errors,
    }),
  });
};
