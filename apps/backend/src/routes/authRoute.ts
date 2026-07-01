import { Router } from "express";
import {
  forgotPasswordController,
  loginController,
  logOutController,
  refreshTokenController,
  registerUserController,
  resetPasswordController,
  verifyEmailController,
} from "../controllers/authController";
import { authenticatedJwt } from "../middlewares/authenticateJwtMiddleware";

const authRoutes = Router();

authRoutes.post("/register", registerUserController);
authRoutes.post("/login", loginController);
authRoutes.get("/refresh", refreshTokenController);
authRoutes.post("/verify/email", verifyEmailController);
authRoutes.post("/password/forgot", forgotPasswordController); // Send verification code to email.
authRoutes.post("/password/reset", resetPasswordController);
authRoutes.post("/logout", authenticatedJwt, logOutController);

export default authRoutes;
