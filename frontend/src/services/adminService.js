import api from "./api";

export const adminService = {
    getStats: () => api.get("/admin/dashboard/stats").then((r) => r.data),

    getVilles: () => api.get("/admin/villes").then((r) => r.data),

    // ---- Agences ----
    getAgences: () => api.get("/admin/agences").then((r) => r.data),
    createAgence: (data) => api.post("/admin/agences", data).then((r) => r.data),
    updateAgence: (id, data) => api.put(`/admin/agences/${id}`, data).then((r) => r.data),
    deleteAgence: (id) => api.delete(`/admin/agences/${id}`).then((r) => r.data),

    // ---- Commerciaux ----
    getCommerciaux: () => api.get("/admin/commerciaux").then((r) => r.data),
    createCommercial: (data) => api.post("/admin/commerciaux", data).then((r) => r.data),
    updateCommercial: (id, data) => api.put(`/admin/commerciaux/${id}`, data).then((r) => r.data),
    deleteCommercial: (id) => api.delete(`/admin/commerciaux/${id}`).then((r) => r.data),

    // ---- Facteurs ----
    getFacteurs: () => api.get("/admin/facteurs").then((r) => r.data),
    createFacteur: (data) => api.post("/admin/facteurs", data).then((r) => r.data),
    updateFacteur: (id, data) => api.put(`/admin/facteurs/${id}`, data).then((r) => r.data),
    deleteFacteur: (id) => api.delete(`/admin/facteurs/${id}`).then((r) => r.data),
};
