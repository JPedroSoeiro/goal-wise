import TeamsPage from "./_components/times";
import { fetchTeams } from "../../../services/times/timesService";

export default async function Page() {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiZW1haWwiOiJ0ZXN0ZUBnbWFpbC5jb20iLCJuYW1lIjoidGVzdGUiLCJpYXQiOjE3NTU2OTMyMjIsImV4cCI6MTc1NTY5NjgyMn0._SwJYOGEF_bHk8ilLtVWeeQdz8FzIQ7p6Cv4gmKwa_s";
  const teams = await fetchTeams(token);
  console.log(teams);
  return <TeamsPage teamsProps={teams} />;
}
