import TeamsPage from "./_components/times";
import { fetchTeams } from "../../../services/times/timesService";

export default async function Page() {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiZW1haWwiOiJ0ZXN0ZUBnbWFpbC5jb20iLCJuYW1lIjoidGVzdGUiLCJpYXQiOjE3NTYxMjk4MTIsImV4cCI6MTc1NjEzMzQxMn0.SjxtcyVKJx05TVCOU2kMa7LcbWk8E9l_DRIETCquxlc";
  const teams = await fetchTeams(token);
  console.log(teams);
  return <TeamsPage teamsProps={teams} />;
}
