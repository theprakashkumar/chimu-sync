import { Router } from "express";
import {
  createProjectController,
  getAllProjectByWorkspaceIdController,
} from "../controllers/projectController";

const projectRouters = Router();

projectRouters.post("/workspace/:workspaceId/create", createProjectController);
projectRouters.get(
  "/workspace/:workspaceId/all",
  getAllProjectByWorkspaceIdController
);

export default projectRouters;
