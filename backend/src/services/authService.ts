import mongoose from "mongoose";
import UserModel from "../models/userModel";
import AccountModel from "../models/accountModal";
import WorkspaceModel from "../models/workspaceModel";
import RoleModel from "../models/rolePermissionModel";
import { Roles } from "../enums/roleEnum";
import {
  BadRequestException,
  HttpException,
  NotFoundException,
  UnauthorizedException,
} from "../utils/appErrors";
import MemberModel from "../models/memberModel";
import { ProviderEnum } from "../enums/accountProviderEnum";
import { ErrorCodeEnum } from "../enums/errorCodeEnum";
import verificationCodeModel from "../models/verificationModel";
import { VerificationEnum } from "../enums/verificationCodeEnum";
import { calculateExpirationDate, fortyFiveMinutesFromNow, ONE_DAY_MS, threeMinutesAgo } from "../utils/dateTime";
import { LoginInput, registerInput, resetPasswordInput } from "../validation/authValidation";
import SessionModel from "../models/sessionModel";
import { accessTokenSignOptions, refreshTokenSignOptions, signJwtToken, verifyJwtToken } from "../utils/jwt";
import { appConfig } from "../config/appConfig";
import { HTTPSTATUS } from "../config/httpConfig";
import { getEnv } from "../utils/getEnv";
import { hashValue } from "../utils/bcrypt";

const registerUserService = async (registerData: registerInput) => {
  const { email, name, password } = registerData;

  const existingUser = await UserModel.exists({ email });
  if (existingUser) {
    throw new BadRequestException("Email already exists!", ErrorCodeEnum.AUTH_EMAIL_ALREADY_EXISTS);
  }

  const hashedPassword = await hashValue(password);
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // Create user.
    const user = new UserModel({
      email,
      name,
      password: hashedPassword,
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
    });
    await verificationCode.save({ session });

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

const loginUserService = async (loginData: LoginInput) => {
  const { email, password, userAgent } = loginData;

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new BadRequestException("Invalid email or password!", ErrorCodeEnum.AUTH_USER_NOT_FOUND)
  }


  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new BadRequestException("Invalid email or password!")
  }

  // TODO: Check if user have enabled 2FA.

  const session = new SessionModel({
    userId: user._id,
    userAgent,
  })
  await session.save();

  if (!session) {
    throw new BadRequestException("Invalid email or password!")
  }

  const accessToken = signJwtToken(
    { userId: user._id, sessionId: session._id },
    accessTokenSignOptions
  )

  const refreshToken = signJwtToken(
    { sessionId: session._id },
    refreshTokenSignOptions
  )

  return {
    user,
    accessToken,
    refreshToken,
    mfaRequired: false
  }
}

const refreshTokenService = async (refreshToken: string) => {
  const { payload } = verifyJwtToken(refreshToken, { secret: refreshTokenSignOptions.secret });

  if (!payload) {
    throw new UnauthorizedException("Invalid refresh token!");
  }
  // Type narrowing.
  if (typeof payload !== "object" || payload === null) {
    throw new UnauthorizedException("Invalid refresh token!");
  }
  if (!("sessionId" in payload)) {
    throw new UnauthorizedException("Invalid refresh token!");
  }

  const session = await SessionModel.findById(payload.sessionId);
  if (!session) {
    throw new UnauthorizedException("Session does not exits!")
  }

  const now = Date.now();
  if (session.expiredAt.getTime() <= now) {
    throw new UnauthorizedException("Session Expired!");
  }
  // If session is expiring in less than one day.
  const sessionRequireRefresh = session.expiredAt.getTime() - now <= ONE_DAY_MS;
  if (sessionRequireRefresh) {
    session.expiredAt = calculateExpirationDate(appConfig.JWT_REFRESH_EXPIRES_IN);
    await session.save();
  }

  const newRefreshToken = sessionRequireRefresh
    ? signJwtToken(
      {
        sessionId: session._id
      },
      refreshTokenSignOptions)
    : undefined

  const accessToken = signJwtToken({
    userId: session.userId,
    sessionId: session._id,
  });

  return { accessToken, newRefreshToken }
}

const verifyEmailService = async (code: string) => {
  const validCode = await verificationCodeModel.findOne({
    code,
    type: VerificationEnum.EMAIL_VERIFICATION,
    expiryAt: { $gt: new Date() }
  })

  if (!validCode) {
    throw new BadRequestException("Invalid verification code!");
  }

  const updatedUser = await UserModel.findByIdAndUpdate(validCode.userId,
    {
      isEmailVerified: true
    },
    // MongoDB to return updated user.
    { new: true }
  )

  if (!updatedUser) {
    throw new BadRequestException(
      "Unable to verify email address",
      ErrorCodeEnum.VALIDATION_ERROR
    )
  }

  // Delete the verification code after successful verification.
  await verificationCodeModel.findByIdAndDelete(validCode._id);

  return {
    user: updatedUser
  }
}

const forgotPasswordService = async (email: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new NotFoundException("User not found!");
  }
  // Only allow to send 2 emails in 3 minutes.
  const timeAgo = threeMinutesAgo();
  const allowedAttempts = 2;
  const attemptsCount = await verificationCodeModel.countDocuments({
    userId: user._id,
    type: VerificationEnum.PASSWORD_RESET,
    createdAt: { $gt: timeAgo }
  });

  if (attemptsCount >= allowedAttempts) {
    throw new HttpException(
      "Too many tries!",
      HTTPSTATUS.TOO_MANY_REQUESTS,
      ErrorCodeEnum.AUTH_TOO_MANY_ATTEMPTS
    )
  }
  // Create new verification code.
  const verificationCode = new verificationCodeModel({
    userId: user._id,
    type: VerificationEnum.PASSWORD_RESET,
    expiryAt: fortyFiveMinutesFromNow()
  });
  await verificationCode.save();

  const resetLink = `${getEnv('FRONTEND_ORIGIN')}/reset-password?code=${verificationCode.code}&exp=${verificationCode.expiryAt.getTime()}`;

  // TODO: Send email with verification URL.

  return {
    url: resetLink,
    email: email
  };
}

const resetPasswordService = async ({ password, verificationCode }: resetPasswordInput) => {
  const validCode = await verificationCodeModel.findOne({
    code: verificationCode,
    type: VerificationEnum.PASSWORD_RESET,
    expiryAt: { $gt: new Date() }
  });

  // TODO: Also verify old password.

  if (!validCode) {
    throw new NotFoundException("Invalid or expired verification code!")
  }

  const hashedPassword = await hashValue(password);

  const updatedUser = await UserModel.findByIdAndUpdate(validCode.userId, {
    password: hashedPassword
  });
  if (!updatedUser) {
    throw new BadRequestException("Failed to update the password!");
  };
  // Delete code and all the active session.
  await validCode.deleteOne();
  await SessionModel.deleteMany({
    userId: updatedUser._id
  });

  return updatedUser;
}

const loginOrCreateAccountService = async (data: {
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

const verifyUserService = async ({
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

export {
  registerUserService,
  loginUserService,
  refreshTokenService,
  verifyEmailService,
  forgotPasswordService,
  resetPasswordService,
  loginOrCreateAccountService,
  verifyUserService
}