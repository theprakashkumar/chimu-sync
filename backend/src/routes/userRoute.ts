import { Router } from "express";
import { getCurrentUserController } from "../controllers/userController";

const userRoute = Router();

userRoute.get("/current", getCurrentUserController);

export default userRoute;
