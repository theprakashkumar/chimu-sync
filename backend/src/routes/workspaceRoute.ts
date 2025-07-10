import { Router } from "express";
import { createWorkspaceController } from "../controllers/workspaceController";

const workspaceRoute = Router();

workspaceRoute.post("/create/new", createWorkspaceController);

export default workspaceRoute;
