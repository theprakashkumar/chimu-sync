import mongoose, { Document, Schema } from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt";

interface UserPreferences {
  enable2FA: boolean;
  emailNotification: boolean;
  twoFactorSecret?: string;
}

export interface UserDocument extends Document {
  name: string;
  email: string;
  password?: string;
  profilePicture: string | null;
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
  isEmailVerified: boolean;
  userPreference: UserPreferences;
  currentWorkspace: mongoose.Types.ObjectId | null;
  comparePassword(value: string): Promise<boolean>;
  omitPassword(): Omit<UserDocument, "password">;
}

// ? In `enable2FA` and `emailNotification` we have default value so we can omit the `required` field.
const userPreferenceSchema = new Schema<UserPreferences>({
  enable2FA: { type: Boolean, default: false },
  emailNotification: { type: Boolean, default: true },
  twoFactorSecret: { type: String, required: false }
})

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    // ? The 'select: false' option means the password field will be excluded in query results by default unless we specifically ask to include the password. But we need password to verify if the password sent by the user is correct so to get the password we set select as `true` here and while sending to client we strip away the password. 
    password: { type: String, select: true },
    profilePicture: {
      type: String,
      default: null,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    userPreference: { type: userPreferenceSchema, default: {} },
    currentWorkspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date, default: null },
  },
  // The 'timestamps: true' option tells Mongoose to automatically add and manage 'createdAt' and 'updatedAt' fields on documents in this collection.
  {
    timestamps: true,
    toJSON: {}
  }
);

// If password is modified then hash the password before saving.
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    if (this.password) {
      this.password = await hashValue(this.password);
    }
  }
  next();
});

// ? If accidentally asked for password or 2FA secret then remove it before sending to client.
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.userPreference.twoFactorSecret;
    return ret;
  }
})


userSchema.methods.comparePassword = async function (value: string) {
  return compareValue(value, this.password);
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);
export default UserModel;
