import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { authApi } from "../../auth/api/authApi";
import { useAuth } from "../../auth/hooks/useAuth";
import { getErrorMessage } from "../../../shared/utils/errorHandler";
import type { DashboardUser, TeamComparisonRow, UserGame } from "../components/dashboard.types";
import { defaultDashboardUser } from "../components/dashboard.types";

const toRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};

const toNumber = (value: unknown, fallback = 0) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

const toGames = (profile: Record<string, unknown>): UserGame[] => {
  const rawGames = Array.isArray(profile.games) ? profile.games : [];
  return rawGames.map((item) => {
    const game = toRecord(item);
    return {
      game: typeof game.game === "string" ? game.game : "",
      gameId: typeof game.gameId === "string" ? game.gameId : "",
      teamName: typeof game.teamName === "string" ? game.teamName : "",
      player2Name: typeof game.player2Name === "string" ? game.player2Name : "",
      player2GameId: typeof game.player2GameId === "string" ? game.player2GameId : "",
      player3Name: typeof game.player3Name === "string" ? game.player3Name : "",
      player3GameId: typeof game.player3GameId === "string" ? game.player3GameId : "",
      player4Name: typeof game.player4Name === "string" ? game.player4Name : "",
      player4GameId: typeof game.player4GameId === "string" ? game.player4GameId : "",
    };
  });
};

const mapProfileToDashboardUser = (profile: Record<string, unknown>, prevUser: DashboardUser): DashboardUser => {
  const stats = toRecord(profile.stats);
  const games = toGames(profile);

  return {
    ...prevUser,
    id: typeof profile.id === "string" ? profile.id : prevUser.id,
    playerName: typeof profile.playerName === "string" ? profile.playerName : prevUser.playerName,
    email: typeof profile.email === "string" ? profile.email : prevUser.email,
    phone: typeof profile.phone === "string" ? profile.phone : prevUser.phone,
    promoCode: typeof profile.promoCode === "string" ? profile.promoCode : prevUser.promoCode,
    address: typeof profile.address === "string" ? profile.address : prevUser.address,
    status: typeof profile.status === "boolean" ? profile.status : prevUser.status,
    role: typeof profile.role === "string" ? profile.role : prevUser.role,
    accountStatus:
      typeof profile.accountStatus === "string"
        ? (profile.accountStatus as DashboardUser["accountStatus"])
        : prevUser.accountStatus,
    createdAt: typeof profile.createdAt === "string" ? profile.createdAt : prevUser.createdAt,
    games,
    stats: {
      totalMatches: toNumber(stats.totalMatches, games.length),
      wins: toNumber(stats.wins),
      losses: toNumber(stats.losses),
      kills: toNumber(stats.kills),
      deaths: toNumber(stats.deaths),
      assists: toNumber(stats.assists),
      topTenFinishes: toNumber(stats.topTenFinishes),
      averagePlacement: toNumber(stats.averagePlacement),
    },
  };
};

export const useDashboardProfile = () => {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [user, setUser] = useState<DashboardUser>(defaultDashboardUser);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!isAuthenticated && !authLoading) {
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      if (authUser) {
        setUser((prev) => ({
          ...prev,
          id: authUser.id,
          playerName: authUser.playerName || prev.playerName,
          email: authUser.email || prev.email,
          role: authUser.role || prev.role,
          status: typeof authUser.status === "boolean" ? authUser.status : prev.status,
        }));
      }

      const profile = await authApi.me();
      setUser((prev) => mapProfileToDashboardUser(toRecord(profile), prev));
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [authLoading, authUser, isAuthenticated, navigate]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const winRate = useMemo(
    () =>
      user.stats.totalMatches > 0 ? ((user.stats.wins / user.stats.totalMatches) * 100).toFixed(1) : "0.0",
    [user.stats.totalMatches, user.stats.wins]
  );

  const kdr = useMemo(
    () => (user.stats.deaths > 0 ? (user.stats.kills / user.stats.deaths).toFixed(2) : "0.00"),
    [user.stats.deaths, user.stats.kills]
  );

  const teamComparison = useMemo<TeamComparisonRow[]>(() => {
    const colors = ["#ff0080", "#00ffff", "#ffd93d", "#ff00ff", "#00d4ff"];
    if (user.games.length === 0) {
      return [];
    }

    return user.games.map((game, index) => ({
      team: game.teamName || `Team ${index + 1}`,
      winRate: Number(winRate),
      kills: user.stats.kills,
      avgPlacement: user.stats.averagePlacement,
      color: colors[index % colors.length],
    }));
  }, [user.games, user.stats.averagePlacement, user.stats.kills, winRate]);

  const handleLogout = useCallback(async () => {
    await logout();
    navigate("/");
  }, [logout, navigate]);

  return {
    user,
    isLoading: isLoading || authLoading,
    error,
    reload: loadProfile,
    handleLogout,
    winRate,
    kdr,
    teamComparison,
  };
};
