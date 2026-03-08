import { UserRole } from "../types";

export const isUserRole = (value: unknown): value is UserRole =>
  value === UserRole.ADMIN || value === UserRole.PLAYER;

export const isAdminRole = (value: unknown): boolean => value === UserRole.ADMIN;

