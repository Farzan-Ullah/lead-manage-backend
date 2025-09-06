import { Router } from "express";
import multer from "multer";
import asyncHandler from "../middleware/asyncHandler.js";
import { validate } from "../middleware/errorHandler.js";
import * as ctrl from "../controllers/lead.controller.js";
import {
  idParam,
  createLeadRules,
  updateLeadRules,
  listLeadRules,
  activityRules,
  statusRules,
  assignRules,
  upsertRules,
} from "../validators/lead.validators.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
});

const r = Router();

r.get("/", listLeadRules, validate, asyncHandler(ctrl.list));

r.post("/", createLeadRules, validate, asyncHandler(ctrl.create));

r.post("/upsert", upsertRules, validate, asyncHandler(ctrl.upsert));

r.get("/duplicates", asyncHandler(ctrl.duplicates));

r.get("/:id", idParam, validate, asyncHandler(ctrl.getById));

r.patch("/:id", idParam, updateLeadRules, validate, asyncHandler(ctrl.update));

r.delete("/:id", idParam, validate, asyncHandler(ctrl.remove));

r.post(
  "/:id/activity",
  idParam,
  activityRules,
  validate,
  asyncHandler(ctrl.addLeadActivity)
);

r.post(
  "/:id/status",
  idParam,
  statusRules,
  validate,
  asyncHandler(ctrl.setStatus)
);

r.post(
  "/:id/assign",
  idParam,
  assignRules,
  validate,
  asyncHandler(ctrl.setOwner)
);

r.post("/import/csv", upload.single("file"), asyncHandler(ctrl.importCSV));

r.get("/export/csv", asyncHandler(ctrl.exportCSV));

export default r;
