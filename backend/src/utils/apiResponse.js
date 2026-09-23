/**
 * Стандарттык API жооптору
 */
export const successResponse = (res, data, message = 'Ийгиликтүү', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (res, message = 'Ката', statusCode = 400, errors = null) => {
  const response = {
    success: false,
    message,
  };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
};

export const paginatedResponse = (res, data, page, limit, total, message = 'Ийгиликтүү') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  });
};