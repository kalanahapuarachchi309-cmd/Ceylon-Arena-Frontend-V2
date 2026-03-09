export interface UserGame {
  game: string;
  gameId: string;
  teamName: string;
  player2Name?: string;
  player2GameId?: string;
  player3Name?: string;
  player3GameId?: string;
  player4Name?: string;
  player4GameId?: string;
}

export interface UserStats {
  wins: number;
  losses: number;
  kills: number;
  deaths: number;
  assists: number;
  topTenFinishes: number;
  totalMatches: number;
  averagePlacement?: number;
}

export interface DashboardUser {
  id?: string;
  createdAt?: string;
  status?: boolean;
  role?: string;
  playerName: string;
  email: string;
  phone: string;
  promoCode?: string;
  address: string;
  accountStatus?: "PENDING" | "COMPLETED" | "FAILED";
  games: UserGame[];
  stats: UserStats;
}

export type DashboardTab = "profile" | "games" | "stats";

export interface TeamComparisonRow {
  team: string;
  winRate: number;
  kills: number;
  avgPlacement?: number;
  color: string;
}

export const defaultDashboardUser: DashboardUser = {
  status: false,
  role: "PLAYER",
  playerName: "",
  email: "",
  phone: "",
  promoCode: "",
  address: "",
  accountStatus: "PENDING",
  stats: {
    totalMatches: 0,
    wins: 0,
    losses: 0,
    kills: 0,
    deaths: 0,
    assists: 0,
    topTenFinishes: 0,
    averagePlacement: 0,
  },
  games: [],
};

