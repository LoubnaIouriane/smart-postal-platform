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

    getACollecter: async () => {
        const response = await api.get("/api/expeditions/a-collecter");
        return response.data;
    },

    getVilles: async () => {
        const response = await api.get("/api/expeditions/villes");
        return response.data;
    },

    getFacteurs: async () => {
        const response = await api.get("/api/expeditions/facteurs");
        return response.data;
    },

    trackByCode: async (code) => {
        const response = await api.get(`/api/expeditions/tracking/${code}`);
        return response.data;
    },

    changerStatut: async (id, statut) => {
        const response = await api.patch(`/api/expeditions/${id}/statut`, { statut });
        return response.data;
    },

    annuler: async (id) => {
        const response = await api.patch(`/api/expeditions/${id}/annuler`);
        return response.data;
    },

    assignerFacteur: async (id, idFacteur) => {
        const response = await api.patch(`/api/expeditions/${id}/facteur`, { idFacteur });
        return response.data;
    },

    enregistrerPoidsReel: async (id, poidsReel) => {
        const response = await api.patch(`/api/expeditions/${id}/poids-reel`, { poidsReel });
        return response.data;
    },
};