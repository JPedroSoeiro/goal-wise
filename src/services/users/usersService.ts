"use server";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0ZUBnbWFpbC5jb20iLCJuYW1lIjoidGVzdGUiLCJpYXQiOjE3NTY3MzM5NTksImV4cCI6MTc1NjczNzU1OX0.zkBNfAzgk3goKEjkYKfzIZ2liKU5SBJkjvKA0zCDOzE";

export async function updateUserTeamPreference(
  userId: string,
  teamId: string
): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ teamId }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Falha ao atualizar a preferência do time"
      );
    }
    const updatedUser = await response.json();
    return updatedUser;
  } catch (error) {
    console.error("Erro ao atualizar time de preferência:", error);
    throw error;
  }
}
