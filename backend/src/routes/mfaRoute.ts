import { Router } from "express";
import { authenticatedJwt } from "../config/passportStrategy";
import { generateMFASetupController } from "../controllers/mfaController";

const mfaRoutes = Router()

mfaRoutes.get("/setup", authenticatedJwt, generateMFASetupController);

export default mfaRoutes;

