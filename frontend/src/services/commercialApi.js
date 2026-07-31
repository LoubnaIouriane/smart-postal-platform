import api from "./api";


// ================= COMMERCIAUX =================

export const getCommerciaux = () =>
    api.get("/commercial/commerciaux")
        .then(r => r.data);


export const getCommercialById = (id) =>
    api.get(`/commercial/commerciaux/${id}`)
        .then(r => r.data);


export const createCommercial = (data) =>
    api.post("/commercial/commerciaux", data)
        .then(r => r.data);


export const updateCommercial = (id, data) =>
    api.put(`/commercial/commerciaux/${id}`, data)
        .then(r => r.data);


export const deleteCommercial = (id) =>
    api.delete(`/commercial/commerciaux/${id}`);




// ================= CLIENTS =================

export const getClients = () =>
    api.get("/commercial/clients")
        .then(r => r.data);




// ================= CONTRATS =================

export const getContrats = () =>
    api.get("/commercial/contrats")
        .then(r => r.data);


export const getContratById = (id) =>
    api.get(`/commercial/contrats/${id}`)
        .then(r => r.data);


export const createContrat = (data) =>
    api.post("/commercial/contrats", data)
        .then(r => r.data);


export const updateContrat = (id, data) =>
    api.put(`/commercial/contrats/${id}`, data)
        .then(r => r.data);


export const deleteContrat = (id) =>
    api.delete(`/commercial/contrats/${id}`);




// ================= GRILLE REMISE =================

export const getGrilles = () =>
    api.get("/commercial/grilles-remise")
        .then(r => r.data);


export const saveGrilleRemise = (data) =>
    api.post("/commercial/grilles-remise", data)
        .then(r => r.data);


export const updateGrille = (id, data) =>
    api.put(`/commercial/grilles-remise/${id}`, data)
        .then(r => r.data);


export const deleteGrille = (id) =>
    api.delete(`/commercial/grilles-remise/${id}`);




// ================= REMISE CLIENT =================

export const getRemisesByClient = (clientId) =>
    api.get(`/commercial/remises-client/client/${clientId}`)
        .then(r => r.data);


export const saveRemiseClient = (data) =>
    api.post("/commercial/remises-client", data)
        .then(r => r.data);


export const deleteRemiseClient = (id) =>
    api.delete(`/commercial/remises-client/${id}`);




// ================= PRE-INSCRIPTIONS =================

export const getPreInscriptions = () =>
    api.get("/commercial/preinscriptions")
        .then(r => r.data);



export const validerPreInscription = (id) =>
    api.put(`/commercial/preinscriptions/${id}/valider`)
        .then(r => r.data);



export const refuserPreInscription = (id) =>
    api.put(`/commercial/preinscriptions/${id}/refuser`)
        .then(r => r.data);




// ================= DASHBOARD =================

export const getDashboard = () =>
    api.get("/commercial/dashboard")
        .then(r => r.data);



export const getDashboardStatistiques = () =>
    api.get("/commercial/dashboard/statistiques")
        .then(r => r.data);