import { useCallback, useEffect, useMemo, useState } from "react";

import type { PaginationParams } from "../../../shared/types";
import { resolveEntityId } from "../../../shared/api/apiTypes";
import { getErrorMessage } from "../../../shared/utils/errorHandler";
import { usersApi } from "../api/usersApi";
import type { ChangeUserRoleRequest, ChangeUserStatusRequest, UserEntity } from "../types/user.types";

export const useUsers = (params?: PaginationParams) => {
  const stableParams = useMemo<PaginationParams | undefined>(
    () =>
      params
        ? {
            page: params.page,
            limit: params.limit,
            search: params.search,
            sortBy: params.sortBy,
            sortOrder: params.sortOrder,
          }
        : undefined,
    [params?.limit, params?.page, params?.search, params?.sortBy, params?.sortOrder]
  );

  const [users, setUsers] = useState<UserEntity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await usersApi.getUsers(stableParams);
      setUsers(result);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [stableParams]);

  useEffect(() => {
    void load();
  }, [load]);

  const changeRole = useCallback(async (id: string, payload: ChangeUserRoleRequest) => {
    const updated = await usersApi.changeUserRole(id, payload);
    setUsers((prev) => prev.map((user) => (resolveEntityId(user) === id ? updated : user)));
    return updated;
  }, []);

  const changeStatus = useCallback(async (id: string, payload: ChangeUserStatusRequest) => {
    const updated = await usersApi.changeUserStatus(id, payload);
    setUsers((prev) => prev.map((user) => (resolveEntityId(user) === id ? updated : user)));
    return updated;
  }, []);

  return { users, isLoading, error, refetch: load, changeRole, changeStatus };
};
