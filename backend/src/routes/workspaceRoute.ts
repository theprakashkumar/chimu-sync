import { Router } from "express";
import {
  createWorkspaceController,
  getAllWorkspaceUserIsMemberController,
  getWorkspaceByIdController,
  getWorkspaceMembersController,
} from "../controllers/workspaceController";

const workspaceRoute = Router();

workspaceRoute.post("/create/new", createWorkspaceController);
workspaceRoute.get("/all", getAllWorkspaceUserIsMemberController);
workspaceRoute.get("/members/:id", getWorkspaceMembersController);
workspaceRoute.get("/:id", getWorkspaceByIdController);

export default workspaceRoute;
