import { apiFetch } from "../api";

interface DashboardTotals {
  totalPlayers: number;
  totalTeams: number;
  totalLigas: number;
}

export async function fetchDashboardTotals(): Promise<DashboardTotals> {
  return apiFetch("/dashboard/totals");
}
