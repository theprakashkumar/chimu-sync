import { Request } from "express";
import { UnauthorizedException } from "../utils/appErrors";
import speakeasy from "speakeasy";
import qrcode from "qrcode";

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

  let secretKey = user.userPreference.towFactorSecret;
  if (!secretKey) {
    const secret = speakeasy.generateSecret({ name: "ChimuSync" });
    secretKey = secret.base32;
    user.userPreference.towFactorSecret = secretKey;
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
    secret: secretKey,
    qrCode: qrImageUrl,
    message: "Scan the QR code or use the setup key!"
  }
};

export { generateMFASetupService };