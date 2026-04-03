import { Router } from "express";
import passport from "passport";
import { appConfig } from "../config/appConfig";
import {
  forgotPasswordController,
  googleLoginCallback,
  loginController,
  logOutController,
  refreshTokenController,
  registerUserController,
  verifyEmailController,
} from "../controllers/authController";

const failedUrl = `${appConfig.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;

const authRoutes = Router();

authRoutes.post("/register", registerUserController);
authRoutes.post("/login", loginController);
authRoutes.get("/refresh", refreshTokenController);
authRoutes.post("/verify/email", verifyEmailController);
authRoutes.post("/password/forgot", forgotPasswordController); // Send verification code to email.
authRoutes.post("/logout", logOutController);

authRoutes.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);
authRoutes.get(
  "/google/callback",
  passport.authenticate("google", {
    failureFlash: failedUrl,
    session: false,
  }),
  googleLoginCallback
);

export default authRoutes;
