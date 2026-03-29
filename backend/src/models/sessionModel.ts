import mongoose, { Document, Schema } from "mongoose";
import { thirtyDaysFromNow } from "../utils/dateTime";

export interface SessionDocument extends Document {
  userId: mongoose.Types.ObjectId;
  userAgent?: string;
  expiredAt: Date;
  createdAt: Date;
}

const sessionSchema = new Schema<SessionDocument>({
  userId: { type: Schema.Types.ObjectId, ref: "User", index: true, required: true },
  userAgent: { type: String, required: false },
  expiredAt: { type: Date, default: Date.now() },
  createdAt: { type: Date, default: thirtyDaysFromNow() },
});

const SessionModel = mongoose.model<SessionDocument>("Session", sessionSchema);

export default SessionModel;
