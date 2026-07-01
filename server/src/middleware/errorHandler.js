export function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || 500;

  if (error.name === "ValidationError") {
    const message = Object.values(error.errors)
      .map((item) => item.message)
      .join(", ");

    res.status(400).json({ message });
    return;
  }

  if (error.code === 11000) {
    res.status(409).json({
      message: "This email is already registered"
    });
    return;
  }

  res.status(statusCode).json({
    message: error.message || "Something went wrong"
  });
}
