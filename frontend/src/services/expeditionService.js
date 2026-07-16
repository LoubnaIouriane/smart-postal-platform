import api from "./api";

export const expeditionService = {
    create: async (expeditionData) => {
        const response = await api.post("/api/expeditions", expeditionData);
        return response.data;
    },

    getAll: async () => {
        const response = await api.get("/api/expeditions");
        return response.data;
    },

    getVilles: async () => {
        const response = await api.get("/api/expeditions/villes");
        return response.data;
    },
};