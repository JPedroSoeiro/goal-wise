import { apiFetch } from "../api";

interface DashboardTotals {
  totalPlayers: number;
  totalTeams: number;
  totalLigas: number;
}

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0ZUBnbWFpbC5jb20iLCJuYW1lIjoidGVzdGUiLCJpYXQiOjE3NTY3MzM5NTksImV4cCI6MTc1NjczNzU1OX0.zkBNfAzgk3goKEjkYKfzIZ2liKU5SBJkjvKA0zCDOzE";

export async function fetchDashboardTotals(): Promise<DashboardTotals> {
  return apiFetch("/dashboard/totals", { token });
}
