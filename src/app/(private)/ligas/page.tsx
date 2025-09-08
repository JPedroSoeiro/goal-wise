"use server";
import LigasPage from "./_components/ligas";
import { fetchLigas, Liga } from "../../../services/ligas/ligasService";

export default async function PageLigas() {
  const ligas = await fetchLigas();
  return <LigasPage ligasProps={ligas} />;
}
