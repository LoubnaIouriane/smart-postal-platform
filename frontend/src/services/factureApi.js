import api from "./axiosConfig";

const BASE = "/facturation/factures";

export const getFactures = () => api.get(BASE).then((response) => response.data);

export const getFactureById = (id) =>
  api.get(`${BASE}/${id}`).then((response) => response.data);

export const getFacturesByClient = (clientId) =>
  api.get(`${BASE}/client/${clientId}`).then((response) => response.data);

export const createFacture = (data) =>
  api.post(BASE, data).then((response) => response.data);

export const marquerFacturePayee = (id) =>
  api.put(`${BASE}/${id}/marquer-payee`).then((response) => response.data);

export const rechercherFactures = (params) =>
  api.get(`${BASE}/recherche`, { params }).then((response) => response.data);

export const genererFacturesMensuelles = () =>
  api.post(`${BASE}/generer-mensuelles`).then((response) => response.data);

export const telechargerPdf = async (id) => {
  const response = await api.get(`${BASE}/${id}/pdf`, { responseType: "blob" });
  return response.data;
};
