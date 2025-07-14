import { Router } from "express";
import { joinedWorkspaceController } from "../controllers/memberController";

const memberRoutes = Router();

memberRoutes.post("/workspace/:inviteCode/join", joinedWorkspaceController);

export default memberRoutes;
