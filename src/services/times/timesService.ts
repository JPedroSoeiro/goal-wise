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
    throw error;
  }
};

export const createTeam = async (
  token: string,
  newTeam: { name: string; image: string }
) => {
  try {
    const response = await fetch(`${API_URL}/api/teams`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newTeam),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Falha ao adicionar time.");
    }

    const addedTeam = await response.json();
    return addedTeam;
  } catch (error) {
    console.error("Erro ao criar time:", error);
    throw error;
  }
};

export const updateTeam = async (
  token: string,
  id: string,
  updatedTeam: { name: string; image: string }
) => {
  try {
    const response = await fetch(`${API_URL}/api/teams/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedTeam),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Falha ao atualizar o time");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao atualizar o time:", error);
    throw error;
  }
};

export const deleteTeam = async (token: string, id: string) => {
  try {
    const response = await fetch(`${API_URL}/api/teams/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Falha ao deletar o time");
    }
    return response.ok;
  } catch (error) {
    console.error("Erro ao deletar o time:", error);
    throw error;
  }
};
