import { Router } from "express";
import {
  generateMFASetupController,
  revokeMFAController,
  verifyMFAForLoginController,
  verifyMFASetupController,
} from "../controllers/mfaController";
import { authenticatedJwt } from "../middlewares/authenticateJwtMiddleware";

const mfaRoutes = Router();

mfaRoutes.get("/setup", authenticatedJwt, generateMFASetupController);
mfaRoutes.post("/verify", authenticatedJwt, verifyMFASetupController);
mfaRoutes.post("/revoke", authenticatedJwt, revokeMFAController);
mfaRoutes.post("/verify-login", verifyMFAForLoginController);

export default mfaRoutes;
