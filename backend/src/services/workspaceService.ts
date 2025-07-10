import mongoose from "mongoose";
import { Roles } from "../enums/roleEnum";
import MemberModel from "../models/memberModel";
import RoleModel from "../models/rolePermissionModel";
import UserModel from "../models/userModel";
import WorkspaceModel from "../models/workspaceModel";
import { NotFoundException } from "../utils/appErrors";

export const createWorkspaceService = async (
  userId: string,
  body: { name: string; description?: string | undefined }
) => {
  const { name, description } = body;
  // Check if user exits in the database.
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new NotFoundException("User not found!");
  }
  // Get the owner rules since it is required to create a workspace.
  const ownerRole = await RoleModel.findOne({ name: Roles.OWNER });
  if (!ownerRole) {
    throw new NotFoundException("Owner role not found!");
  }
  // Create new workspace.
  const workspace = new WorkspaceModel({
    name,
    description,
    owner: user._id,
  });
  await workspace.save();

  // Create new member.
  const member = new MemberModel({
    userId: user._id,
    workspaceId: workspace._id,
    role: ownerRole._id,
    joinedAt: new Date(),
  });
  await member.save();
  // Set user's current workspace to newly created workspace.
  user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
  await user.save();

  return { workspace };
};
