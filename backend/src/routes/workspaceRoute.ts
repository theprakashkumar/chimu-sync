import { Router } from "express";
import {
  createWorkspaceController,
  getAllWorkspaceUserIsMemberController,
  getWorkspaceByIdController,
} from "../controllers/workspaceController";

const workspaceRoute = Router();

workspaceRoute.get("/:id", getWorkspaceByIdController);
workspaceRoute.post("/create/new", createWorkspaceController);
workspaceRoute.get("/all", getAllWorkspaceUserIsMemberController);

export default workspaceRoute;
