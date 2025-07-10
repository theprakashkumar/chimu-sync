import { Router } from "express";
import {
  createWorkspaceController,
  getAllWorkspaceUserIsMemberController,
} from "../controllers/workspaceController";

const workspaceRoute = Router();

workspaceRoute.post("/create/new", createWorkspaceController);
workspaceRoute.get("/all", getAllWorkspaceUserIsMemberController);

export default workspaceRoute;
