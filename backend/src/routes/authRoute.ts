import { Router } from "express";
import passport from "passport";
import { appConfig } from "../config/appConfig";
import { googleLoginCallback } from "../controllers/authController";

const failedUrl = `${appConfig.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;

const authRoute = Router();

authRoute.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

authRoute.get(
  "/google/callback",
  passport.authenticate("google", {
    failureFlash: failedUrl,
  }),
  googleLoginCallback
);

export default authRoute;
