"use server";
import TeamsPage from "./_components/times";
import { fetchTeams } from "../../../services/times/timesService";

export default async function PageTimes() {
  const teams = await fetchTeams();

  return <TeamsPage teamsProps={teams} />;
}
