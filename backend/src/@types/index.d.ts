import { UserDocument } from "../models/userModel";

declare global {
  namespace Express {
    interface User extends UserDocument {
      _id: any;
    }
    interface Request {
      jwt?: string;
    }
  }
}
