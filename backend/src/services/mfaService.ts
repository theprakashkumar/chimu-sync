import { Request } from "express";
import { BadRequestException, NotFoundException, UnauthorizedException } from "../utils/appErrors";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import UserModel from "../models/userModel";
import SessionModel from "../models/sessionModel";
import { accessTokenSignOptions, refreshTokenSignOptions, signJwtToken } from "../utils/jwt";

const generateMFASetupService = async (req: Request) => {
  const user = req.user;
  if (!user) {
    throw new UnauthorizedException("User not authorized!")
  }

  if (user.userPreference.enable2FA) {
    return {
      message: "MFA already enabled!"
    }
  }

  let secretKey = user.userPreference.twoFactorSecret;
  if (!secretKey) {
    const secret = speakeasy.generateSecret({ name: "ChimuSync" });
    secretKey = secret.base32;
    user.userPreference.twoFactorSecret = secretKey;
    await user.save();
  }

  const url = speakeasy.otpauthURL({
    secret: secretKey,
    label: user.email,
    issuer: "chimusync",
    encoding: "base32"
  })

  const qrImageUrl = await qrcode.toDataURL(url);

  return {
    data: {
      secret: secretKey,
      qrCode: qrImageUrl,
    },
    message: "Scan the QR code or use the setup key!"
  }
};

const verifyMFASetupService = async (req: Request, code: string, secretKey: string) => {
  const user = req.user;
  if (!user) {
    throw new UnauthorizedException("User not authorized!")
  }

  // If MFA is already active:
  if (user.userPreference.enable2FA) {
    return {
      URLSearchParams: {
        enable2FA: user.userPreference.enable2FA
      },
      message: "MFA is already enabled!"
    }
  }

  const isValid = speakeasy.totp.verify({
    secret: secretKey,
    encoding: "base32",
    token: code
  });
  if (!isValid) {
    throw new BadRequestException("Invalid MFA code, please try again!");
  }

  user.userPreference.enable2FA = true;
  await user.save();

  return {
    userPreferences: {
      enable2FA: user.userPreference.enable2FA
    },
    message: "MFA setup completed successfully!"
  }
}

const revokeMFAService = async (req: Request) => {
  const user = req.user;

  if (!user) {
    throw new UnauthorizedException("User not authorized!")
  }

  if (!user.userPreference.enable2FA) {
    return {
      userPreferences: {
        enable2FA: user.userPreference.enable2FA,
      },
      message: "MFA is not enabled!"
    }
  }

  user.userPreference.twoFactorSecret = undefined;
  user.userPreference.enable2FA = false;
  await user.save();

  return {
    userPreferences: {
      enable2FA: user.userPreference.enable2FA,
    },
    message: "MFA revoked successfully!"
  }

}

const verifyMFAForLoginService = async (code: string, email: string, userAgent?: string) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new NotFoundException("User not found!");
  }

  if (!user.userPreference.enable2FA && !user.userPreference.twoFactorSecret) {
    throw new UnauthorizedException("MFA not enabled!");
  }

  const isValid = speakeasy.totp.verify({
    secret: user.userPreference.twoFactorSecret!,
    encoding: "base32",
    token: code
  })

  if (!isValid) {
    throw new BadRequestException("Invalid MFA code!");
  }

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
  }
}

export {
  generateMFASetupService,
  verifyMFASetupService,
  revokeMFAService,
  verifyMFAForLoginService
};