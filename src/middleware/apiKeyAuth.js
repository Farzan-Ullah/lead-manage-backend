export default function apiKeyAuth(req, res, next) {
  const expected = process.env.API_KEY;
  if (!expected) return next();
  const provided = req.header("x-api-key");
  if (provided === expected) return next();
  return res.status(401).json({ ok: false, error: "unauthorized" });
}
