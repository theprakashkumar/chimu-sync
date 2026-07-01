const AUTH_ROUTES = {
  SIGN_IN: "/",
  SIGN_UP: "/sign-up",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  GOOGLE_OAUTH_CALLBACK: "/google/oauth/callback",
  VERIFY_EMAIL: "verify-email",
  VERIFY_MFA: "verify-mfa",
};

const PROTECTED_ROUTES = {
  ACCOUNT: "/account",
  WORKSPACE: "/workspace/:workspaceId",
  TASKS: "/workspace/:workspaceId/tasks",
  MEMBERS: "/workspace/:workspaceId/members",
  SETTINGS: "/workspace/:workspaceId/settings",
  PROJECT_DETAILS: "/workspace/:workspaceId/project/:projectId",
};

const BASE_ROUTE = {
  INVITE_URL: "/invite/workspace/:inviteCode/join",
};

const isAuthRoute = (pathname: string): boolean => {
  return Object.values(AUTH_ROUTES).includes(pathname);
};

export { AUTH_ROUTES, BASE_ROUTE, isAuthRoute, PROTECTED_ROUTES };
