import { Router } from "express";
import {
  changeWorkspaceMemberRoleController,
  createWorkspaceController,
  deleteWorkspaceByIdController,
  getAllWorkspaceUserIsMemberController,
  getWorkspaceAnalyticsController,
  getWorkspaceByIdController,
  getWorkspaceMembersController,
  updateWorkspaceByIdController,
} from "../controllers/workspaceController";

const workspaceRoutes = Router();

workspaceRoutes.post("/create/new", createWorkspaceController);
workspaceRoutes.put("/update/:id", updateWorkspaceByIdController);
workspaceRoutes.put(
  "/change/member/role/:id",
  changeWorkspaceMemberRoleController
);
workspaceRoutes.delete("/delete/:id", deleteWorkspaceByIdController);
workspaceRoutes.get("/all", getAllWorkspaceUserIsMemberController);
workspaceRoutes.get("/members/:id", getWorkspaceMembersController);
// This will give use the task done vs task have not been done.
workspaceRoutes.get("/analytics/:id", getWorkspaceAnalyticsController);
workspaceRoutes.get("/:id", getWorkspaceByIdController);

export default workspaceRoutes;
