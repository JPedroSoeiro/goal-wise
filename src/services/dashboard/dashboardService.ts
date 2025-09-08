import { apiFetch } from "../api";

interface DashboardTotals {
  totalPlayers: number;
  totalTeams: number;
  totalLigas: number;
}

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0ZUBnbWFpbC5jb20iLCJuYW1lIjoiSm9hbyBQZWRybyIsImlhdCI6MTc1NzM1NTY4MCwiZXhwIjoxNzU3MzU5MjgwfQ.v5CjitN8JVwyAwF_GBdWRyoluVYJUgSu20555xTeXNE";

export async function fetchDashboardTotals(): Promise<DashboardTotals> {
  return apiFetch("/dashboard/totals", { token });
}
