import mongoose, { Schema } from "mongoose";
import { VerificationEnum } from "../enums/verificationCodeEnum";
import { generateVerificationCode } from "../utils/uuid";

export interface VerificationCodeDocument extends Document {
  userId: mongoose.Types.ObjectId;
  code: string;
  type: VerificationEnum;
  expiryAt: Date;
  createdAt: Date;
}

const verificationCodeSchema = new Schema<VerificationCodeDocument>({
  userId: { type: Schema.Types.ObjectId, ref: "User", index: true, required: true },
  code: { type: String, unique: true, required: true, default: generateVerificationCode },
  type: { type: String, required: true },
  expiryAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
})

const verificationCodeModel = mongoose.model<VerificationCodeDocument>("verificationCode", verificationCodeSchema);

export default verificationCodeModel;