import "dotenv/config";
import express, { Response } from "express";
// import session from "cookie-session";
import cors from "cors";
import { appConfig } from "./config/appConfig";
import connectDatabase from "./config/databaseConfig";
import { errorHandler } from "./middlewares/errorHandlerMiddleware";
import { HTTPSTATUS } from "./config/httpConfig";
import { asyncHandler } from "./middlewares/asyncHandlerMiddleware";
import "./config/passportConfig";
import passport from "passport";
import authRoutes from "./routes/authRoute";
// import isAuthenticated from "./middlewares/isAuthenticatedMiddleware";
import memberRoutes from "./routes/memberRoute";
import userRoutes from "./routes/userRoute";
import workspaceRoutes from "./routes/workspaceRoute";
import projectRouters from "./routes/projectRoute";
import taskRouters from "./routes/taskRoute";
import cookieParser from "cookie-parser";
import { authenticatedJwt } from "./config/passportStrategy";
import "./middlewares/passport";
import sessionRoute from "./routes/sessionRoute";
import mfaRoutes from "./routes/mfaRoute";

const app = express();

// Parses JSON payloads (Content-Type: application/json)
app.use(express.json());
// - express.urlencoded({ extended: true }) parses URL-encoded payloads (from HTML forms)
app.use(express.urlencoded({ extended: true }));
// ? Express middleware, it reads the Cookie header on each request, parses it, and attaches the result to req.cookies as a plain object
app.use(cookieParser());
app.use(passport.initialize());

// Cookie-based session is a way to store session data on the client side using cookies.
// The session middleware below configures how session cookies are created and managed:
// - 'name': Sets the name of the cookie that holds the session data ("session").
// - 'keys': Uses SESSION_SECRET to sign and verify the cookie, ensuring its integrity.
// - 'maxAge': Sets the cookie to expire after 24 hours.
// - 'secure': Ensures cookies are only sent over HTTPS in production environments.
// - 'httpOnly': Prevents JavaScript from accessing the cookie, enhancing security.
// - 'sameSite': Limits the cookie to same-site requests (lax mode) to help prevent CSRF attacks.
// app.use(
//   session({
//     name: "session",
//     keys: [appConfig.SESSION_SECRET],
//     maxAge: 24 * 60 * 60 * 1000,
//     secure: appConfig.NODE_ENV === "production",
//     httpOnly: true,
//     sameSite: "lax",
//   })
// );


// app.use(passport.session());

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
