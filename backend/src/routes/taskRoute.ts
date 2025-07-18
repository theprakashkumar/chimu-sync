import { Router } from "express";
import {
  createTaskController,
  updateTaskController,
} from "../controllers/taskController";

const taskRouters = Router();

taskRouters.post(
  "/project/:projectId/workspace/:workspaceId/create",
  createTaskController
);

taskRouters.put(
  "/:id/project/:projectId/workspace/:workspaceId/update",
  updateTaskController
);

export default taskRouters;
