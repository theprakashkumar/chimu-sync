import mongoose from "mongoose";
import UserModel from "../models/userModel";
import AccountModel from "../models/accountModal";
import WorkspaceModel from "../models/workspaceModel";
import RoleModel from "../models/rolePermissionModel";
import { Roles } from "../enums/roleEnum";
import { BadRequestException, NotFoundException } from "../utils/appErrors";
import MemberModel from "../models/memberModel";
import { ProviderEnum } from "../enums/accountProviderEnum";

export const loginOrCreateAccountService = async (data: {
  provider: string;
  displayName: string;
  providerId: string;
  picture?: string;
  email?: string;
}) => {
  const { provider, displayName, providerId, picture, email } = data;
  // Creating a session here as we have to create a workspace just after creating a user.
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    console.info("Started a session for create/login user.");
    let user = await UserModel.findOne({ email }).session(session);
    if (!user) {
      user = new UserModel({
        email,
        name: displayName,
        profilePicture: picture || null,
      });
      await user.save({ session });

      const account = new AccountModel({
        userId: user._id,
        provider,
        providerId,
      });

      await account.save({ session });

      // Create workspace.
      const workspace = new WorkspaceModel({
        name: "My Workspace",
        description: `Workspace created for ${user.name}`,
        owner: user._id,
      });

      await workspace.save({ session });

      const ownerRole = await RoleModel.findOne({
        name: Roles.OWNER,
      }).session(session);

      if (!ownerRole) {
        throw new NotFoundException("Owner role not found!");
      }

      const member = new MemberModel({
        userId: user._id,
        workspaceId: workspace._id,
        role: ownerRole._id,
        joinedAt: new Date(),
      });

      await member.save({ session });

      user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;

      await user.save({ session });
    }
    await session.commitTransaction();
    session.endSession();
    console.info("Ended a session for create/login user.");

    return { user };
  } catch (error) {
    // If something goes wrong abort the session.
    await session.abortTransaction();
    session.endSession();
    throw error;
  } finally {
    session.endSession();
  }
};

export const registerUserService = async (body: {
  email: string;
  name: string;
  password: string;
}) => {
  const { email, name, password } = body;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const existingUser = await UserModel.findOne({ email }).session(session);
    if (existingUser) {
      throw new BadRequestException("Email already exists!");
    }
    // Create user.
    const user = new UserModel({
      email,
      name,
      password,
    });
    await user.save({ session });
    // Create an account.
    const account = new AccountModel({
      userId: user._id,
      provider: ProviderEnum.EMAIL,
      providerId: email,
    });
    await account.save({ session });
    // Create workspace.
    const workspace = new WorkspaceModel({
      name: "My Workspace",
      description: `Workspace created for ${user.name}`,
      owner: user._id,
    });
    await workspace.save({ session });
    // Find the rules for owners and create new member for above create workspace with new user, new workspace and owner role.
    const ownerRole = await RoleModel.findOne({
      name: Roles.OWNER,
    }).session(session);

    if (!ownerRole) {
      throw new NotFoundException("Owner role not found!");
    }

    const member = new MemberModel({
      userId: user._id,
      workspaceId: workspace._id,
      role: ownerRole._id,
      joinedAt: new Date(),
    });

    await member.save({ session });

    // Set the current workspace for new user as newly created workspace.
    user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    return { userId: user._id, workspaceId: workspace._id };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
