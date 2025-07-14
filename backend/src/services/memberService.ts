import { ErrorCodeEnum } from "../enums/errorCodeEnum";
import { Roles } from "../enums/roleEnum";
import MemberModel from "../models/memberModel";
import RoleModel from "../models/rolePermissionModel";
import WorkspaceModel from "../models/workspaceModel";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../utils/appErrors";

export const getMemberRoleInWorkspace = async (
  userId: string,
  workspaceId: string
) => {
  const workspace = await WorkspaceModel.findById(workspaceId);
  if (!workspace) {
    throw new NotFoundException("Workspace not found!");
  }

  const member = await MemberModel.findOne({
    userId,
    workspaceId,
  }).populate("role");

  if (!member) {
    throw new UnauthorizedException(
      "You are not a member of this workspace",
      ErrorCodeEnum.ACCESS_UNAUTHORIZED
    );
  }

  const role = member.role?.name;

  return { role };
};

export const joinWorkspaceByInviteService = async (
  userId: string,
  inviteCode: string
) => {
  // Find the workspace by invite code.
  const workspace = await WorkspaceModel.findOne({ inviteCode }).exec();
  if (!workspace) {
    throw new NotFoundException("Invalid invite code or workspace not found!");
  }
  // Check if user already exists in the workspace.
  const existingMember = await MemberModel.findOne({
    userId,
    workspaceId: workspace._id,
  }).exec();

  console.log(existingMember);
  if (existingMember) {
    throw new BadRequestException("Member already exits.");
  }

  const role = await RoleModel.findOne({ name: Roles.MEMBER });
  if (!role) {
    throw new NotFoundException("Role not found!");
  }

  const newMember = new MemberModel({
    userId,
    workspaceId: workspace._id,
    role: role._id,
    joinedAt: new Date(),
  });

  await newMember.save();

  return { workspaceId: workspace._id, role: role.name };
};
