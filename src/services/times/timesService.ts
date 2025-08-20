const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchTeams = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/api/teams`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Falha ao buscar teams");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar teams:", error);
  }
};
