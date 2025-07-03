import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import session from "cookie-session";
import cors from "cors";
import { appConfig } from "./config/appConfig";

const app = express();
const BASE_PATH = appConfig.BASE_PATH;

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

app.use(
  cors({
    origin: appConfig.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    message: "Home",
  });
});

app.listen(appConfig.PORT, async () => {
  console.log(
    `Server listening on port ${appConfig.PORT} in ${appConfig.NODE_ENV}.`
  );
});
