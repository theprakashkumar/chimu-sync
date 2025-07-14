import { Router } from "express";
import {
  changeWorkspaceMemberRoleController,
  createWorkspaceController,
  getAllWorkspaceUserIsMemberController,
  getWorkspaceAnalyticsController,
  getWorkspaceByIdController,
  getWorkspaceMembersController,
  updateWorkspaceByIdController,
} from "../controllers/workspaceController";

const workspaceRoute = Router();

workspaceRoute.post("/create/new", createWorkspaceController);
workspaceRoute.put("/update/:id", updateWorkspaceByIdController);
workspaceRoute.put(
  "/change/member/role/:id",
  changeWorkspaceMemberRoleController
);
workspaceRoute.get("/all", getAllWorkspaceUserIsMemberController);
workspaceRoute.get("/members/:id", getWorkspaceMembersController);
// This will give use the task done vs task have not been done.
workspaceRoute.get("/analytics/:id", getWorkspaceAnalyticsController);
workspaceRoute.get("/:id", getWorkspaceByIdController);

export default workspaceRoute;
