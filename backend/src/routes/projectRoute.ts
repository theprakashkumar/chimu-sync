import { Router } from "express";
import {
  createProjectController,
  getAllProjectByWorkspaceIdController,
  getProjectByIdAndWorkspaceIdController,
} from "../controllers/projectController";

const projectRouters = Router();

projectRouters.post("/workspace/:workspaceId/create", createProjectController);
projectRouters.get(
  "/workspace/:workspaceId/all",
  getAllProjectByWorkspaceIdController
);
projectRouters.get(
  "/:id/workspace/:workspaceId",
  getProjectByIdAndWorkspaceIdController
);

export default projectRouters;
