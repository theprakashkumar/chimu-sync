import { Router } from "express";
import {
  createProjectController,
  getAllProjectByWorkspaceIdController,
  getProjectAnalyticsController,
  getProjectByIdAndWorkspaceIdController,
  updateProjectController,
} from "../controllers/projectController";

const projectRouters = Router();

projectRouters.post("/workspace/:workspaceId/create", createProjectController);

projectRouters.put(
  "/:id/workspace/:workspaceId/update",
  updateProjectController
);

projectRouters.get(
  "/workspace/:workspaceId/all",
  getAllProjectByWorkspaceIdController
);
projectRouters.get(
  "/:id/workspace/:workspaceId/analytics",
  getProjectAnalyticsController
);
projectRouters.get(
  "/:id/workspace/:workspaceId",
  getProjectByIdAndWorkspaceIdController
);

export default projectRouters;
