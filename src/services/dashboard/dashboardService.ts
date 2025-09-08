import { apiFetch } from "../api";

interface DashboardTotals {
  totalPlayers: number;
  totalTeams: number;
  totalLigas: number;
}

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0ZUBnbWFpbC5jb20iLCJuYW1lIjoidGVzdGUiLCJpYXQiOjE3NTczMzU4MDYsImV4cCI6MTc1NzMzOTQwNn0.ISCTiMckW_xPQVTp3b2NxQ3C7aUmo5Zl1gc3FnaM2u4";

export async function fetchDashboardTotals(): Promise<DashboardTotals> {
  return apiFetch("/dashboard/totals", { token });
}
