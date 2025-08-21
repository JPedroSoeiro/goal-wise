import TeamsPage from "./_components/times";
import { fetchTeams } from "../../../services/times/timesService";

export default async function Page() {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiZW1haWwiOiJ0ZXN0ZUBnbWFpbC5jb20iLCJuYW1lIjoidGVzdGUiLCJpYXQiOjE3NTU3OTcxMDksImV4cCI6MTc1NTgwMDcwOX0.7UJmsNEhqJRidtXH0l8qfex3Lvov22-QsdqGOx5oJqE";
  const teams = await fetchTeams(token);
  console.log(teams);
  return <TeamsPage teamsProps={teams} />;
}
