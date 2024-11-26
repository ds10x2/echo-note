// src/api/sttApi.js
import apiClient from "@services/apiConfig";

// STT 결과를 가져오는 함수
export const getSTTResult = async (id) => {
  try {
    const response = await apiClient.get(`/voice/stt?id=${id}`);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Failed to fetch STT result");
      throw new Error("Failed to fetch STT result");
    }
  } catch (error) {
    console.error("Error fetching STT result:", error);
    throw error;
  }
};

// STT 업데이트 함수
export const modifySTTResult = async (id, modifiedData) => {
  try {
    const payload = {
      id,
      result: modifiedData,
    };

    const response = await apiClient.put("/voice/stt", payload);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Failed to update STT result");
      throw new Error("Failed to update STT result");
    }
  } catch (error) {
    console.error("Error updating STT result:", error);
    throw error;
  }
};
