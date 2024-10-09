import apiClient from "@services/apiConfig";

// 노트 리스트 가져오는 함수
export const getNoteList = async () => {
  try {
    const response = await apiClient.get(`/note/list`);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Failed to fetch note list");
      throw new Error("Failed to fetch note list");
    }
  } catch (error) {
    console.error("Error fetching note list:", error);
    throw error;
  }
};

export const getNoteDetail = async (id) => {
  try {
    const response = await apiClient.get(`/note`, {
      params: {
        noteId: id, // 쿼리 파라미터로 noteId 전달
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Failed to fetch note detail");
      throw new Error("Failed to fetch note detail");
    }
  } catch (error) {
    console.error("Error fetching note detail:", error);
    throw error;
  }
};
