import api from "./api";

export const getCommerciaux = () => api.get("/commercial/commerciaux").then(r => r.data);
export const getCommercialById = (id) => api.get(`/commercial/commerciaux/${id}`).then(r => r.data);
export const createCommercial = (data) => api.post("/commercial/commerciaux", data).then(r => r.data);
export const updateCommercial = (id, data) => api.put(`/commercial/commerciaux/${id}`, data).then(r => r.data);
export const deleteCommercial = (id) => api.delete(`/commercial/commerciaux/${id}`);

export const getClients = () => api.get("/commercial/clients").then(r => r.data);

export const getContrats = () => api.get("/commercial/contrats").then(r => r.data);
export const createContrat = (data) => api.post("/commercial/contrats", data).then(r => r.data);
export const updateContrat = (id, data) => api.put(`/commercial/contrats/${id}`, data).then(r => r.data);
export const deleteContrat = (id) => api.delete(`/commercial/contrats/${id}`);

export const getGrilles = () => api.get("/commercial/grilles-remise").then(r => r.data);
export const createGrille = (data) => api.post("/commercial/grilles-remise", data).then(r => r.data);
export const updateGrille = (id, data) => api.put(`/commercial/grilles-remise/${id}`, data).then(r => r.data);
export const deleteGrille = (id) => api.delete(`/commercial/grilles-remise/${id}`);