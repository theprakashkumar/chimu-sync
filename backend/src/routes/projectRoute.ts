import { Router } from "express";
import { createProjectController } from "../controllers/projectController";

const projectRouters = Router();

projectRouters.post("/workspace/:workspaceId/create", createProjectController);

export default projectRouters;
