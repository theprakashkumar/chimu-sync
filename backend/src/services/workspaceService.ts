import mongoose from "mongoose";
import { Roles } from "../enums/roleEnum";
import MemberModel from "../models/memberModel";
import RoleModel from "../models/rolePermissionModel";
import UserModel from "../models/userModel";
import WorkspaceModel from "../models/workspaceModel";
import { BadRequestException, NotFoundException } from "../utils/appErrors";
import TaskModel from "../models/taskModel";
import { TaskStatusEnum } from "../enums/taskEnum";
import ProjectModel from "../models/projectModel";

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

export const getWorkspaceMembersService = async (workspaceId: string) => {
  const members = await MemberModel.find({ workspaceId })
    .populate("userId", "name email profilePicture -password")
    .populate("role", "name");

  // This code retrieves all roles from the RoleModel collection, but only includes the 'name' and '_id' fields for each role.
  // It also explicitly excludes the 'permission' field from the results.
  // The 'lean()' method is used to return plain JavaScript objects instead of Mongoose documents for better performance.
  const roles = await RoleModel.find({}, { name: 1, _id: 1 })
    .select("-permission")
    .lean();

  return { members, roles };
};

export const getWorkspaceAnalyticsService = async (workspaceId: string) => {
  const currentDate = new Date();

  const totalTasks = await TaskModel.countDocuments({
    workspace: workspaceId,
  });

  const overdueTasks = await TaskModel.countDocuments({
    workspace: workspaceId,
    // lt stands for less than.
    dueDate: { $lt: currentDate },
    // ne stands for not equals
    status: { $ne: TaskStatusEnum.DONE },
  });

  const completedTasks = await TaskModel.countDocuments({
    workspace: workspaceId,
    status: TaskStatusEnum.DONE,
  });

  const analytics = {
    totalTasks,
    overdueTasks,
    completedTasks,
  };

  return { analytics };
};

export const changeMemberRoleService = async (
  workspaceId: string,
  memberId: string,
  roleId: string
) => {
  const workspace = await WorkspaceModel.findById(workspaceId);
  if (!workspace) {
    throw new NotFoundException("Workspace not found!");
  }
  const role = await RoleModel.findById(roleId);
  if (!role) {
    throw new NotFoundException("Role not found!");
  }
  // Check if user is member of workspace.
  const member = await MemberModel.findOne({ userId: memberId, workspaceId });

  if (!member) {
    throw new Error("Member not found in the workspace.");
  }
  member.role = role;

  await role.save();
  return { member };
};

export const updateWorkspaceByIdService = async (
  workspaceId: string,
  name: string,
  description?: string
) => {
  const workspace = await WorkspaceModel.findById(workspaceId);
  if (!workspace) {
    throw new NotFoundException("Workspace not found!");
  }
  workspace.name = name || workspace.name;
  workspace.description = description || workspace.description;

  const updatedWorkspace = await workspace.save();

  return { workspace: updatedWorkspace };
};

export const deleteWorkspaceByIdService = async (
  workspaceId: string,
  userId: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const workspace = await WorkspaceModel.findById(workspaceId).session(
      session
    );
    if (!workspace) {
      throw new NotFoundException("Workspace not found!");
    }
    // Only the user who owns the workspace can delete the workspace.
    if (workspace.owner.toString() !== userId) {
      throw new BadRequestException(
        "You are not authorized to delete this workspace."
      );
    }

    const user = await UserModel.findById(userId).session(session);
    if (!user) {
      throw new NotFoundException("User not found!");
    }

    // Delete all the project associated with the workspace.
    await ProjectModel.deleteMany({ workspace: workspace._id }).session(
      session
    );
    // Delete all the task associated with the workspace.
    await TaskModel.deleteMany({ workspace: workspace._id }).session(session);
    // Delete all the members associated with the workspace.
    await WorkspaceModel.deleteMany({ workspaceId: workspace._id }).session(
      session
    );
    // Update the user's currentWorkspace if it matches the deleted workspace.
    if (user?.currentWorkspace?.equals(workspaceId)) {
      // Pick any workspace and update to the user's current workspace.
      const memberWorkspace = await MemberModel.findOne({ userId }).session(
        session
      );
      user.currentWorkspace = memberWorkspace
        ? memberWorkspace.workspaceId
        : null;

      await user.save({ session });
    }

    await workspace.deleteOne({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      currentWorkspace: user.currentWorkspace,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
