import UserModel from "../models/userModel";
import { BadRequestException } from "../utils/appErrors";

export const getCurrentUserService = async (userId: string) => {
  const user = await UserModel.findById(userId)
    .populate("currentWorkspace")
    .select("-password"); // - Will omit the password.

  if (!user) {
    throw new BadRequestException("User not found!");
  }

  return { user };
};
