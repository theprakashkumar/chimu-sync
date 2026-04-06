import { Router } from "express";
import { authenticatedJwt } from "../config/passportStrategy";
import { generateMFASetupController, revokeMFAController, verifyMFAForLoginController, verifyMFASetupController } from "../controllers/mfaController";

const mfaRoutes = Router()

mfaRoutes.get("/setup", authenticatedJwt, generateMFASetupController);
mfaRoutes.post("/verify", authenticatedJwt, verifyMFASetupController);
mfaRoutes.post("/revoke", authenticatedJwt, revokeMFAController);
mfaRoutes.post("/verify-login", verifyMFAForLoginController);

export default mfaRoutes;

