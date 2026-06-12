import { Router } from "express";
import {
  createTaskController,
  deleteTaskController,
  getAllTaskController,
  getTaskByIdController,
  updateTaskController,
} from "../controllers/taskController";

const taskRouters = Router();

taskRouters.post(
  "/project/:projectId/workspace/:workspaceId/create",
  createTaskController
);

taskRouters.delete("/:id/workspace/:workspaceId/delete", deleteTaskController);

taskRouters.put(
  "/:id/project/:projectId/workspace/:workspaceId/update",
  updateTaskController
);

taskRouters.get("/workspace/:workspaceId/all", getAllTaskController);

taskRouters.get(
  "/:id/project/:projectId/workspace/:workspaceId",
  getTaskByIdController
);

export default taskRouters;
