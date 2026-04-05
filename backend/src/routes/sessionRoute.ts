import { Router } from "express";
import { getAllSessionController } from "../controllers/sessionController";

const sessionRoute = Router();

sessionRoute.get("/all", getAllSessionController);

export default sessionRoute;