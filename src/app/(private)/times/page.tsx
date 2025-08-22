import TeamsPage from "./_components/times";
import { fetchTeams } from "../../../services/times/timesService";

export default async function Page() {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiZW1haWwiOiJ0ZXN0ZUBnbWFpbC5jb20iLCJuYW1lIjoidGVzdGUiLCJpYXQiOjE3NTU4ODEwMDIsImV4cCI6MTc1NTg4NDYwMn0.ztEt_ZrFr3l6h2DRmaw72iAMX5Jd9z08PJj4BnY2v5Q";
  const teams = await fetchTeams(token);
  console.log(teams);
  return <TeamsPage teamsProps={teams} />;
}
