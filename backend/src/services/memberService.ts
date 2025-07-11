import { ErrorCodeEnum } from "../enums/errorCodeEnum";
import MemberModel from "../models/memberModel";
import WorkspaceModel from "../models/workspaceModel";
import { NotFoundException, UnauthorizedException } from "../utils/appErrors";

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
