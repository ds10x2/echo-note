import apiClient from "@services/apiConfig";

export const getSTTResult = async (id) => {
  try {
    const response = await apiClient.get(`/voice/stt?id=${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
