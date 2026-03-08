import type { Team } from "../../../shared/types";

export interface UpdateTeamRequest {
  teamName?: string;
  primaryGame?: string;
  leaderInGameId?: string;
  members?: Array<{
    name: string;
    inGameId: string;
  }>;
  isActive?: boolean;
}

export type TeamEntity = Team;
