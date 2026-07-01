export interface LoginResponseType {
  message: string;
  data: {
    mfaRequired: boolean;
    user: {
      email: string;
      name: string;
      profilePicture: string;
      currentWorkspace: string;
    };
  };
}
