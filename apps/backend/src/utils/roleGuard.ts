import { PermissionType } from "../enums/roleEnum";
import { UnauthorizedException } from "./appErrors";
import { RolePermissions } from "./rolePermission";

export const roleGuard = (
  role: keyof typeof RolePermissions,
  requiredPermission: PermissionType[]
) => {
  const permissions = RolePermissions[role];
  // If role doesn't exist or lacks required permission, throw an exception.
  const hasPermission = requiredPermission.every((permission) =>
    permissions.includes(permission)
  );

  if (!hasPermission) {
    throw new UnauthorizedException(
      "You don't have necessary permission to perform this action."
    );
  }
};
