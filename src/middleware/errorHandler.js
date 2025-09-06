import { validationResult } from "express-validator";

export function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  const formatted = errors.array().map((e) => ({ field: e.path, msg: e.msg }));
  return res
    .status(422)
    .json({ ok: false, error: "validation_error", details: formatted });
}

export default function errorHandler(err, req, res, next) {
  // eslint-disable-line
  const status = err.status || 500;
  const body = {
    ok: false,
    error: err.name || "Error",
    message: err.message || "Something went wrong",
  };
  if (process.env.NODE_ENV !== "production" && err.stack)
    body.stack = err.stack;
  res.status(status).json(body);
}
