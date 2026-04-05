import { Router } from "express";
import { getAllSessionController, getCurrentSessionController } from "../controllers/sessionController";

const sessionRoute = Router();

sessionRoute.get("/all", getAllSessionController);
sessionRoute.get("/current", getCurrentSessionController);

export default sessionRoute;