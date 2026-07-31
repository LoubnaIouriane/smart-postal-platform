import {
  createFacture,
  genererFacturesMensuelles,
  getFactureById,
  getFactures,
  getFacturesByClient,
  marquerFacturePayee,
  rechercherFactures,
  telechargerPdf,
} from "./factureApi";

const factureService = {
  getAll: getFactures,
  getById: getFactureById,
  getByClient: getFacturesByClient,
  creer: createFacture,
  marquerPayee: marquerFacturePayee,
  rechercher: rechercherFactures,
  genererMensuelles: genererFacturesMensuelles,
  telechargerPdf,
};

export default factureService;
