import {
  PermissionType,
  TaskPriorityEnumType,
  TaskStatusEnumType,
} from "@/constant";


interface loginType {
  email: string;
  password: string;
};

interface LoginResponseType {
  message: string;
  data: {
    mfaRequired: boolean;
    email: string;
    name: string;
    profilePicture: string;
    currentWorkspace: string;
  };
};

interface registerType {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

interface verifyEmail {
  code: string;
}

interface forgotPasswordType {
  email: string;
}

interface resetPasswordType {
  password: string;
  verificationCode: string;
}

type UserType = {
  _id: string;
  name: string;
  email: string;
  profilePicture: string | null;
  isActive: true;
  lastLogin: null;
  createdAt: Date;
  updatedAt: Date;
  currentWorkspace: {
    _id: string;
    name: string;
    owner: string;
    inviteCode: string;
  };
  userPreference: {
    _id: string;
    enable2FA: boolean;
    emailNotification: boolean;
  }
};

type CurrentUserResponseType = {
  message: string;
  user: UserType;
};

interface MFASetupType {
  data: {
    secret: string;
    qrCode: string;
  },
  message: string;
}

interface VerifyMFAType {
  code: string;
  secretKey: string;
}

//******** */ WORKSPACE TYPES ****************
// ******************************************
type WorkspaceType = {
  _id: string;
  name: string;
  description?: string;
  owner: string;
  inviteCode: string;
};

type CreateWorkspaceType = {
  name: string;
  description: string;
};

type EditWorkspaceType = {
  workspaceId: string;
  data: {
    name: string;
    description: string;
  };
};

type CreateWorkspaceResponseType = {
  message: string;
  workspace: WorkspaceType;
};

type AllWorkspaceResponseType = {
  message: string;
  workspace: WorkspaceType[];
};

type WorkspaceWithMembersType = WorkspaceType & {
  members: {
    _id: string;
    userId: string;
    workspaceId: string;
    role: {
      _id: string;
      name: string;
      permissions: PermissionType[];
    };
    joinedAt: string;
    createdAt: string;
  }[];
};

type WorkspaceByIdResponseType = {
  message: string;
  workspace: WorkspaceWithMembersType;
};

type ChangeWorkspaceMemberRoleType = {
  workspaceId: string;
  data: {
    roleId: string;
    memberId: string;
  };
};

type AllMembersInWorkspaceResponseType = {
  message: string;
  members: {
    _id: string;
    userId: {
      _id: string;
      name: string;
      email: string;
      profilePicture: string | null;
    };
    workspaceId: string;
    role: {
      _id: string;
      name: string;
    };
    joinedAt: string;
    createdAt: string;
  }[];
  roles: RoleType[];
};

type AnalyticsResponseType = {
  message: string;
  analytics: {
    totalTasks: number;
    overdueTasks: number;
    completedTasks: number;
  };
};

type PaginationType = {
  totalCount: number;
  pageSize: number;
  pageNumber: number;
  totalPages: number;
  skip: number;
  limit: number;
};

type RoleType = {
  _id: string;
  name: string;
};
// *********** MEMBER ****************

//******** */ PROJECT TYPES ****************
//****************************************** */
type ProjectType = {
  _id: string;
  name: string;
  emoji: string;
  description: string;
  workspace: string;
  createdBy: {
    _id: string;
    name: string;
    profilePicture: string;
  };
  createdAt: string;
  updatedAt: string;
};

type CreateProjectPayloadType = {
  workspaceId: string;
  data: {
    emoji: string;
    name: string;
    description: string;
  };
};

type ProjectResponseType = {
  message: "Project created successfully";
  project: ProjectType;
};

type EditProjectPayloadType = {
  workspaceId: string;
  projectId: string;
  data: {
    emoji: string;
    name: string;
    description: string;
  };
};

//ALL PROJECTS IN WORKSPACE TYPE
type AllProjectPayloadType = {
  workspaceId: string;
  pageNumber?: number;
  pageSize?: number;
  keyword?: string;
  skip?: boolean;
};

type AllProjectResponseType = {
  message: string;
  projects: ProjectType[];
  pagination: PaginationType;
};

// SINGLE PROJECT IN WORKSPACE TYPE
type ProjectByIdPayloadType = {
  workspaceId: string;
  projectId: string;
};

//********** */ TASK TYPES ************************
//************************************************* */

type CreateTaskPayloadType = {
  workspaceId: string;
  projectId: string;
  data: {
    title: string;
    description: string;
    priority: TaskPriorityEnumType;
    status: TaskStatusEnumType;
    assignedTo: string;
    dueDate: string;
  };
};

type TaskType = {
  _id: string;
  title: string;
  description?: string;
  project?: {
    _id: string;
    emoji: string;
    name: string;
  };
  priority: TaskPriorityEnumType;
  status: TaskStatusEnumType;
  assignedTo: {
    _id: string;
    name: string;
    profilePicture: string | null;
  } | null;
  createdBy?: string;
  dueDate: string;
  taskCode: string;
  createdAt?: string;
  updatedAt?: string;
};

type AllTaskPayloadType = {
  workspaceId: string;
  projectId?: string | null;
  keyword?: string | null;
  priority?: TaskPriorityEnumType | null;
  status?: TaskStatusEnumType | null;
  assignedTo?: string | null;
  dueDate?: string | null;
  pageNumber?: number | null;
  pageSize?: number | null;
};

type AllTaskResponseType = {
  message: string;
  tasks: TaskType[];
  pagination: PaginationType;
};

export type {
  loginType,
  LoginResponseType,
  registerType,
  verifyEmail,
  forgotPasswordType,
  resetPasswordType,
  UserType,
  CurrentUserResponseType,
  MFASetupType,
  VerifyMFAType,
  WorkspaceType,
  CreateWorkspaceType,
  EditWorkspaceType,
  CreateWorkspaceResponseType,
  AllWorkspaceResponseType,
  WorkspaceWithMembersType,
  WorkspaceByIdResponseType,
  ChangeWorkspaceMemberRoleType,
  AllMembersInWorkspaceResponseType,
  AnalyticsResponseType,
  PaginationType,
  RoleType,
  ProjectType,
  CreateProjectPayloadType,
  ProjectResponseType,
  EditProjectPayloadType,
  AllProjectPayloadType,
  AllProjectResponseType,
  ProjectByIdPayloadType,
  CreateTaskPayloadType,
  TaskType,
  AllTaskPayloadType,
  AllTaskResponseType,
};