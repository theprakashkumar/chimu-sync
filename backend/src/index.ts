import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import session from "cookie-session";
import cors from "cors";
import { appConfig } from "./config/appConfig";
import connectDatabase from "./config/databaseConfig";
import { errorHandler } from "./middlewares/errorHandlerMiddleware";
import { HTTPSTATUS } from "./config/httpConfig";
import { asyncHandler } from "./middlewares/asyncHandlerMiddleware";
import "./config/passportConfig";
import passport from "passport";
import authRoute from "./routes/authRoute";
import userRoute from "./routes/userRoute";
import isAuthenticated from "./middlewares/isAuthenticatedMiddleware";
import workspaceRoute from "./routes/workspaceRoute";

const app = express();

// Parses JSON payloads (Content-Type: application/json)
app.use(express.json());
// - express.urlencoded({ extended: true }) parses URL-encoded payloads (from HTML forms)
app.use(express.urlencoded({ extended: true }));

// Cookie-based session is a way to store session data on the client side using cookies.
// The session middleware below configures how session cookies are created and managed:
// - 'name': Sets the name of the cookie that holds the session data ("session").
// - 'keys': Uses SESSION_SECRET to sign and verify the cookie, ensuring its integrity.
// - 'maxAge': Sets the cookie to expire after 24 hours.
// - 'secure': Ensures cookies are only sent over HTTPS in production environments.
// - 'httpOnly': Prevents JavaScript from accessing the cookie, enhancing security.
// - 'sameSite': Limits the cookie to same-site requests (lax mode) to help prevent CSRF attacks.
app.use(
  session({
    name: "session",
    keys: [appConfig.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
    secure: appConfig.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: appConfig.FRONTEND_ORIGIN,
    credentials: true,
  })
);
// asyncHandler wraps the controller in a try catch block, so if anything goes wrong in the controller catch block will run which calls the next function with error and that is taken care by error handler and we don't have to wrap every controller inside the try catch block.
app.get(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.status(HTTPSTATUS.OK).json({
      message: "Home",
    });
  })
);

app.use(`${appConfig.BASE_PATH}/auth`, authRoute);
app.use(`${appConfig.BASE_PATH}/user`, isAuthenticated, userRoute);
app.use(`${appConfig.BASE_PATH}/workspace`, isAuthenticated, workspaceRoute);

// Error handling.
app.use(errorHandler);

app.listen(appConfig.PORT, async () => {
  console.info(
    `Server listening on port ${appConfig.PORT} in ${appConfig.NODE_ENV}.`
  );
  await connectDatabase();
});
