import type { User } from "../../../shared/types";

export interface ChangeUserRoleRequest {
  role: "ADMIN" | "PLAYER";
}

export interface ChangeUserStatusRequest {
  isActive: boolean;
}

export type UserEntity = User;
