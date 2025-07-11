import mongoose from "mongoose";
import { Roles } from "../enums/roleEnum";
import MemberModel from "../models/memberModel";
import RoleModel from "../models/rolePermissionModel";
import UserModel from "../models/userModel";
import WorkspaceModel from "../models/workspaceModel";
import { NotFoundException, UnauthorizedException } from "../utils/appErrors";
import { ErrorCodeEnum } from "../enums/errorCodeEnum";

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

export const getAllWorkspaceISMemberService = async (userId: string) => {
  // Get all the membership.
  const memberships = await MemberModel.find({ userId })
    .populate("workspaceId")
    .select("-password")
    .exec();
  // Get list of workspace.
  const workspace = memberships.map((membership) => membership.workspaceId);

  return { workspace };
};

export const getWorkspaceByIdService = async (
  workspaceId: string,
  userId: string
) => {
  const workspace = await WorkspaceModel.findById(workspaceId);
  if (!workspace) {
    throw new NotFoundException("Workspace not found!");
  }
  // User should be the member of workspace in order to access the workspace.
  const member = await MemberModel.findOne({ userId, workspaceId }).populate(
    "role"
  );
  console.log(workspaceId, userId);
  // If given user is not a member of found workspace.
  if (!member) {
    throw new UnauthorizedException(
      "You are not a member of this workspace",
      ErrorCodeEnum.ACCESS_UNAUTHORIZED
    );
  }
  // User is member of workspace. Now get all the members who are also member of workspace.
  const members = await MemberModel.find({
    workspaceId,
  }).populate("role");

  const workspaceWithMembers = {
    ...workspace.toObject(),
    members,
  };

  return {
    workspace: workspaceWithMembers,
  };
};
