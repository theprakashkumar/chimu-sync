import { Router } from "express";
import { deleteSessionController, getAllSessionController, getCurrentSessionController } from "../controllers/sessionController";

const sessionRoute = Router();

sessionRoute.get("/all", getAllSessionController);
sessionRoute.get("/current", getCurrentSessionController);
sessionRoute.delete("/:id", deleteSessionController);

export default sessionRoute;