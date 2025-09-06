import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    line1: { type: String, trim: true },
    line2: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, trim: true },
  },
  { _id: false }
);

const ActivitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["note", "call", "email", "meeting", "status-change"],
      default: "note",
    },
    note: { type: String, trim: true },
    createdBy: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const StatusHistorySchema = new mongoose.Schema(
  {
    from: { type: String },
    to: { type: String },
    changedAt: { type: Date, default: Date.now },
    changedBy: { type: String },
  },
  { _id: false }
);

const LeadSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true, unique: true },
    phone: { type: String, trim: true, unique: true },
    company: { type: String, trim: true },
    title: { type: String, trim: true },
    source: {
      type: String,
      trim: true,
      default: "unknown",
      enum: [
        "unknown",
        "website",
        "referral",
        "ads",
        "social",
        "event",
        "outbound",
        "other",
      ],
    },
    status: {
      type: String,
      trim: true,
      default: "new",
      enum: ["new", "contacted", "qualified", "lost", "converted"],
    },
    owner: { type: String, trim: true, index: true },
    value: { type: Number, min: 0, default: 0 },
    address: { type: AddressSchema },
    tags: { type: [String], default: [] },
    custom: { type: Map, of: String },
    activities: { type: [ActivitySchema], default: [] },
    statusHistory: { type: [StatusHistorySchema], default: [] },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// LeadSchema.index({ email: 1 });
// LeadSchema.index({ phone: 1 });
LeadSchema.index({ status: 1, source: 1, owner: 1 });
LeadSchema.index({ company: "text", firstName: "text", lastName: "text" });

export default mongoose.model("Lead", LeadSchema);
