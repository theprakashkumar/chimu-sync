import { Router } from "express";
import {
  createWorkspaceController,
  getAllWorkspaceUserIsMemberController,
  getWorkspaceAnalyticsController,
  getWorkspaceByIdController,
  getWorkspaceMembersController,
} from "../controllers/workspaceController";

const workspaceRoute = Router();

workspaceRoute.post("/create/new", createWorkspaceController);
workspaceRoute.get("/all", getAllWorkspaceUserIsMemberController);
workspaceRoute.get("/members/:id", getWorkspaceMembersController);
// This will give use the task done vs task have not been done.
workspaceRoute.get("/analytics/:id", getWorkspaceAnalyticsController);
workspaceRoute.get("/:id", getWorkspaceByIdController);

export default workspaceRoute;
