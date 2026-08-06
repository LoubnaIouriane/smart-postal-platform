import {  getFactureById,
  getFactures,
  getFacturesByClient,  rechercherFactures,
  telechargerPdf,
} from "./factureApi";

const factureService = {
  getAll: getFactures,
  getById: getFactureById,
  getByClient: getFacturesByClient,
  creer:  marquerPayee:  rechercher: rechercherFactures,
  genererMensuelles:  telechargerPdf,
};

export default factureService;

