import "dotenv/config";
import express, { Response } from "express";
import cors from "cors";
import { appConfig } from "./config/appConfig";
import connectDatabase from "./config/databaseConfig";
import { errorHandler } from "./middlewares/errorHandlerMiddleware";
import { HTTPSTATUS } from "./config/httpConfig";
import { asyncHandler } from "./middlewares/asyncHandlerMiddleware";
import authRoutes from "./routes/authRoute";
import memberRoutes from "./routes/memberRoute";
import userRoutes from "./routes/userRoute";
import workspaceRoutes from "./routes/workspaceRoute";
import projectRouters from "./routes/projectRoute";
import taskRouters from "./routes/taskRoute";
import cookieParser from "cookie-parser";
import { authenticatedJwt } from "./middlewares/authenticateJwtMiddleware";
import sessionRoute from "./routes/sessionRoute";
import mfaRoutes from "./routes/mfaRoute";

const app = express();

// Parses JSON payloads (Content-Type: application/json)
app.use(express.json());
// - express.urlencoded({ extended: true }) parses URL-encoded payloads (from HTML forms)
app.use(express.urlencoded({ extended: true }));
// ? Express middleware, it reads the Cookie header on each request, parses it, and attaches the result to req.cookies as a plain object
app.use(cookieParser());

app.use(
  cors({
    // ? Only allow the origin from the environment variable.
    origin: appConfig.FRONTEND_ORIGIN,
    // ? This is used to allow the cookies to be sent to the client.
    credentials: true,
  })
);

// ? `asyncHandler` wraps the controller in a try catch block, so if anything goes wrong in the controller catch block will run which calls the next function with error and that is taken care by error handler and we don't have to wrap every controller inside the try catch block.
app.get(
  "/",
  asyncHandler(async (_, res: Response) => {
    res.status(HTTPSTATUS.OK).json({
      message: "Home",
    });
  })
);

app.use(`${appConfig.BASE_PATH}/auth`, authRoutes);
app.use(`${appConfig.BASE_PATH}/mfa`, mfaRoutes);
app.use(`${appConfig.BASE_PATH}/user`, authenticatedJwt, userRoutes);
app.use(
  `${appConfig.BASE_PATH}/workspace`,
  authenticatedJwt,
  workspaceRoutes
);
app.use(`${appConfig.BASE_PATH}/session`, authenticatedJwt, sessionRoute);
app.use(`${appConfig.BASE_PATH}/member`, authenticatedJwt, memberRoutes);
app.use(
  `${appConfig.BASE_PATH}/project`,
  authenticatedJwt,
  projectRouters
);
app.use(`${appConfig.BASE_PATH}/task`, authenticatedJwt, taskRouters);

// ? Error handling, catches all the errors that may occur in the application and sends the response to the client.
app.use(errorHandler);

app.listen(appConfig.PORT, async () => {
  console.info(
    `Server listening on port ${appConfig.PORT} in ${appConfig.NODE_ENV}.🚀`
  );
  await connectDatabase();
});
