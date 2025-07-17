import { Router } from "express";
import { createTaskController } from "../controllers/taskController";

const taskRouters = Router();

taskRouters.post(
  "/projects/:projectId/workspace/:workspaceId/create",
  createTaskController
);

export default taskRouters;
