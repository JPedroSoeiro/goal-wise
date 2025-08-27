"use server";
import TeamsPage from "./_components/times";
import { fetchTeams } from "../../../services/times/timesService";

export default async function Page() {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0ZUBnbWFpbC5jb20iLCJuYW1lIjoidGVzdGUiLCJpYXQiOjE3NTYzMTc3NjQsImV4cCI6MTc1NjMyMTM2NH0.wvN97xx5lDBBH6Go027GHTwbXdB4SHcVhZNCizdDI_s";
  const teams = await fetchTeams(token);
  console.log(teams);
  return <TeamsPage teamsProps={teams} />;
}
