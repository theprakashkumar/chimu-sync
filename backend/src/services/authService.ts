import mongoose from "mongoose";
import UserModel from "../models/userModel";
import AccountModel from "../models/accountModal";
import WorkspaceModel from "../models/workspaceModel";
import RoleModel from "../models/rolePermissionModel";
import { Roles } from "../enums/roleEnum";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../utils/appErrors";
import MemberModel from "../models/memberModel";
import { ProviderEnum } from "../enums/accountProviderEnum";
import { ErrorCodeEnum } from "../enums/errorCodeEnum";
import verificationCodeModel from "../models/verificationModel";
import { VerificationEnum } from "../enums/verificationCodeEnum";
import { fortyFiveMinutesFromNow } from "../utils/dateTime";
import { LoginInput, registerInput } from "../validation/authValidation";
import SessionModel from "../models/sessionModel";
import jwt, { SignOptions } from "jsonwebtoken";
import { appConfig } from "../config/appConfig";

export const registerUserService = async (registerData: registerInput) => {
  const { email, name, password } = registerData;

  const existingUser = await UserModel.exists({ email });
  if (existingUser) {
    throw new BadRequestException("Email already exists!", ErrorCodeEnum.AUTH_EMAIL_ALREADY_EXISTS);
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
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

    // Create a verification code
    const verificationCode = new verificationCodeModel({
      userId: user._id,
      type: VerificationEnum.EMAIL_VERIFICATION,
      expiryAt: fortyFiveMinutesFromNow()
    })

    // Send verification code

    // // Create workspace.
    // const workspace = new WorkspaceModel({
    //   name: "My Workspace",
    //   description: `Workspace created for ${user.name}`,
    //   owner: user._id,
    // });
    // await workspace.save({ session });
    // // Find the rules for owners and create new member for above create workspace with new user, new workspace and owner role.
    // const ownerRole = await RoleModel.findOne({
    //   name: Roles.OWNER,
    // }).session(session);

    // if (!ownerRole) {
    //   throw new NotFoundException("Owner role not found!");
    // }

    // const member = new MemberModel({
    //   userId: user._id,
    //   workspaceId: workspace._id,
    //   role: ownerRole._id,
    //   joinedAt: new Date(),
    // });

    // await member.save({ session });

    // // Set the current workspace for new user as newly created workspace.
    // user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
    // await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    // return { userId: user._id, workspaceId: workspace._id };
    return { user };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const loginUserService = async (loginData: LoginInput) => {
  const { email, password, userAgent } = loginData;

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new BadRequestException("Invalid email or password!", ErrorCodeEnum.AUTH_USER_NOT_FOUND)
  }


  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new BadRequestException("Invalid email or password!")
  }

  // Check if user have enabled 2FA.

  const session = new SessionModel({
    userId: user._id,
    userAgent,
  })

  const accessToken = jwt.sign(
    { userId: user._id, sessionId: session._id },
    appConfig.JWT_SECRET,
    {
      audience: ["user"],
      expiresIn: appConfig.JWT_EXPIRES_IN as SignOptions['expiresIn'],
    }
  )

  const refreshToken = jwt.sign(
    { sessionId: session._id },
    appConfig.JWT_REFRESH_SECRET,
    {
      audience: ["user"],
      expiresIn: appConfig.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
    }
  )

  return {
    user,
    accessToken,
    refreshToken,
    mfaRequired: false
  }
}

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

export const verifyUserService = async ({
  email,
  password,
  provider = ProviderEnum.EMAIL,
}: {
  email: string;
  password: string;
  provider?: string;
}) => {
  // Find account.
  const account = await AccountModel.findOne({ provider, providerId: email });

  if (!account) {
    throw new NotFoundException("Invalid email or password!");
  }

  const user = await UserModel.findById(account.userId);

  if (!user) {
    throw new NotFoundException("User not found for the given email.");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new UnauthorizedException("Invalid email or password.");
  }

  return user;
};
