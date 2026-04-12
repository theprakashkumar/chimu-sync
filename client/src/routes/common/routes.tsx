import GoogleOAuth from "@/page/auth/GoogleOAuth";
import SignIn from "@/page/auth/Sign-in";
import SignUp from "@/page/auth/Sign-up";
import ForgotPassword from "@/page/auth/forgot-password";
import WorkspaceDashboard from "@/page/workspace/Dashboard";
import Members from "@/page/workspace/Members";
import ProjectDetails from "@/page/workspace/ProjectDetails";
import Settings from "@/page/workspace/Settings";
import Tasks from "@/page/workspace/Tasks";
import { AUTH_ROUTES, BASE_ROUTE, PROTECTED_ROUTES } from "./routePaths";
import InviteUser from "@/page/invite/InviteUser";
import ResetPassword from "@/page/auth/reset-password";
import VerifyEmail from "@/page/auth/verify-email";
import Account from "@/page/auth/account";
import VerifyMFA from "@/page/auth/verify-mfa";

const authenticationRoutePaths = [
  { path: AUTH_ROUTES.SIGN_IN, element: <SignIn /> },
  { path: AUTH_ROUTES.SIGN_UP, element: <SignUp /> },
  { path: AUTH_ROUTES.FORGOT_PASSWORD, element: <ForgotPassword /> },
  { path: AUTH_ROUTES.RESET_PASSWORD, element: <ResetPassword /> },
  { path: AUTH_ROUTES.GOOGLE_OAUTH_CALLBACK, element: <GoogleOAuth /> },
  { path: AUTH_ROUTES.VERIFY_EMAIL, element: <VerifyEmail /> },
  { path: AUTH_ROUTES.VERIFY_MFA, element: <VerifyMFA /> },
];

const workspaceProtectedRoutePaths = [
  { path: PROTECTED_ROUTES.WORKSPACE, element: <WorkspaceDashboard /> },
  { path: PROTECTED_ROUTES.TASKS, element: <Tasks /> },
  { path: PROTECTED_ROUTES.MEMBERS, element: <Members /> },
  { path: PROTECTED_ROUTES.SETTINGS, element: <Settings /> },
  { path: PROTECTED_ROUTES.PROJECT_DETAILS, element: <ProjectDetails /> },
];

const standaloneProtectedRoutePaths = [
  { path: PROTECTED_ROUTES.ACCOUNT, element: <Account /> },
];

const baseRoutePaths = [
  { path: BASE_ROUTE.INVITE_URL, element: <InviteUser /> },
];

export {
  authenticationRoutePaths,
  workspaceProtectedRoutePaths,
  standaloneProtectedRoutePaths,
  baseRoutePaths,
};
