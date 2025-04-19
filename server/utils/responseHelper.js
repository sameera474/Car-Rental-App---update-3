export const successResponse = (res, data) => {
  res.status(200).json({ success: true, data });
};

export const errorResponse = (res, message, status = 500) => {
  res.status(status).json({ success: false, message });
};
