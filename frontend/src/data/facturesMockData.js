// Donnees CONSTANTES (mock) pour la demonstration front-end du module Facturation.
// Aucun appel au backend n'est effectue : les montants et informations ci-dessous
// sont fixes et ne representent pas de vraies factures.

// Mois minimum autorise dans le filtre de la liste commerciale
export const MOIS_MINIMUM = "2026-07";

// ============================================================
// FACTURES VUE COMMERCIAL (plusieurs clients differents)
// ============================================================
export const FACTURES_MOCK = [
  {
    idFacture: 1,
    numeroFacture: "FAC-2026-0001",
    clientRaisonSociale: "Client Demo Test",
    dateEmission: "2026-07-15",
    dateEcheance: "2026-08-14",
    tauxRemise: 0,
    montantHT: 850,
    montantRemise: 0,
    tauxTVA: 20,
    montantTVA: 170,
    montantTTC: 1020,
    statutPaiement: "PAYEE",
    datePaiement: "2026-08-01",
    lignes: [
      {
        idLigne: 11,
        designation: "Envoi colis standard - Casablanca",
        codeExpedition: "EXP000000004",
        poidsReel: "5.0 kg",
        destinataire: "Youssef Amrani",
        quantite: 5,
        prixUnitaire: 90,
        montantLigne: 450,
      },
      {
        idLigne: 12,
        designation: "Envoi courrier recommande - Rabat",
        codeExpedition: "EXP000000007",
        poidsReel: "1.2 kg",
        destinataire: "Fatima Zahra Idrissi",
        quantite: 8,
        prixUnitaire: 50,
        montantLigne: 400,
      },
    ],
  },
  {
    idFacture: 2,
    numeroFacture: "FAC-2026-0002",
    clientRaisonSociale: "Atlas Logistics SARL",
    dateEmission: "2026-08-05",
    dateEcheance: "2026-09-04",
    tauxRemise: 5,
    montantHT: 900,
    montantRemise: 45,
    tauxTVA: 20,
    montantTVA: 171,
    montantTTC: 1026,
    statutPaiement: "NON_PAYEE",
    datePaiement: null,
    lignes: [
      {
        idLigne: 21,
        designation: "Envoi colis standard - Tanger",
        codeExpedition: "EXP000000032",
        poidsReel: "5.2 kg",
        destinataire: "Karim Benali",
        quantite: 6,
        prixUnitaire: 100,
        montantLigne: 600,
      },
      {
        idLigne: 22,
        designation: "Envoi courrier recommande - Fes",
        codeExpedition: "EXP000000045",
        poidsReel: "1.8 kg",
        destinataire: "Nadia Chraibi",
        quantite: 6,
        prixUnitaire: 50,
        montantLigne: 300,
      },
    ],
  },
  {
    idFacture: 3,
    numeroFacture: "FAC-2026-0003",
    clientRaisonSociale: "SIMSIM Solutions SARL",
    dateEmission: "2026-09-10",
    dateEcheance: "2026-10-10",
    tauxRemise: 0,
    montantHT: 310,
    montantRemise: 0,
    tauxTVA: 20,
    montantTVA: 62,
    montantTTC: 372,
    statutPaiement: "NON_PAYEE",
    datePaiement: null,
    lignes: [
      {
        idLigne: 31,
        designation: "Envoi colis standard - Marrakech",
        codeExpedition: "EXP000000019",
        poidsReel: "3.0 kg",
        destinataire: "Omar Saidi",
        quantite: 2,
        prixUnitaire: 90,
        montantLigne: 180,
      },
      {
        idLigne: 32,
        designation: "Envoi courrier simple - Agadir",
        codeExpedition: "EXP000000021",
        poidsReel: "0.5 kg",
        destinataire: "Salma Tazi",
        quantite: 2,
        prixUnitaire: 65,
        montantLigne: 130,
      },
    ],
  },
  {
    idFacture: 4,
    numeroFacture: "FAC-2026-0004",
    clientRaisonSociale: "Al Amal Trading",
    dateEmission: "2026-10-02",
    dateEcheance: "2026-11-01",
    tauxRemise: 10,
    montantHT: 2000,
    montantRemise: 200,
    tauxTVA: 20,
    montantTVA: 360,
    montantTTC: 2160,
    statutPaiement: "PAYEE",
    datePaiement: "2026-10-20",
    lignes: [
      {
        idLigne: 41,
        designation: "Envoi colis standard - Oujda",
        codeExpedition: "EXP000000058",
        poidsReel: "12.4 kg",
        destinataire: "Hicham Idrissi",
        quantite: 10,
        prixUnitaire: 130,
        montantLigne: 1300,
      },
      {
        idLigne: 42,
        designation: "Envoi courrier recommande - Laayoune",
        codeExpedition: "EXP000000061",
        poidsReel: "2.1 kg",
        destinataire: "Amina Ouazzani",
        quantite: 10,
        prixUnitaire: 70,
        montantLigne: 700,
      },
    ],
  },
];

// ============================================================
// FACTURES VUE CLIENT (historique commun a tout client connecte)
// La raison sociale est remplacee a l'affichage par le nom reel
// du client connecte (recupere depuis le token JWT).
// ============================================================
const FACTURES_CLIENT = [
  {
    idFacture: 101,
    numeroFacture: "FAC-2026-0101",
    dateEmission: "2026-07-20",
    dateEcheance: "2026-07-19",
    tauxRemise: 3,
    montantHT: 850,
    montantRemise: 0,
    tauxTVA: 20,
    montantTVA: 170,
    montantTTC: 1020,
    statutPaiement: "PAYEE",
    datePaiement: "2026-08-05",
    lignes: [
      {
        idLigne: 1011,
        designation: "Envoi colis standard - Casablanca",
        codeExpedition: "EXP000000004",
        poidsReel: "5.0 kg",
        destinataire: "Youssef Amrani",
        quantite: 5,
        prixUnitaire: 90,
        montantLigne: 450,
      },
      {
        idLigne: 1012,
        designation: "Envoi courrier recommande - Rabat",
        codeExpedition: "EXP000000007",
        poidsReel: "1.2 kg",
        destinataire: "Fatima Zahra Idrissi",
        quantite: 8,
        prixUnitaire: 50,
        montantLigne: 400,
      },
    ],
  },
  {
    idFacture: 102,
    numeroFacture: "FAC-2026-0102",
    dateEmission: "2026-07-18",
    dateEcheance: "2026-08-29",
    tauxRemise: 5,
    montantHT: 640,
    montantRemise: 32,
    tauxTVA: 20,
    montantTVA: 121.6,
    montantTTC: 729.6,
    statutPaiement: "NON_PAYEE",
    datePaiement: null,
    lignes: [
      {
        idLigne: 1021,
        designation: "Envoi colis standard - Tanger",
        codeExpedition: "EXP000000033",
        poidsReel: "4.6 kg",
        destinataire: "Karim Benali",
        quantite: 4,
        prixUnitaire: 100,
        montantLigne: 400,
      },
      {
        idLigne: 1022,
        designation: "Envoi courrier simple - Fes",
        codeExpedition: "EXP000000048",
        poidsReel: "0.9 kg",
        destinataire: "Nadia Chraibi",
        quantite: 4,
        prixUnitaire: 60,
        montantLigne: 240,
      },
    ],
  },
  {
    idFacture: 103,
    numeroFacture: "FAC-2026-0103",
    dateEmission: "2026-08-05",
    dateEcheance: "2026-09-05",
    tauxRemise: 0,
    montantHT: 430,
    montantRemise: 0,
    tauxTVA: 20,
    montantTVA: 86,
    montantTTC: 516,
    statutPaiement: "NON_PAYEE",
    datePaiement: null,
    lignes: [
      {
        idLigne: 1031,
        designation: "Envoi colis standard - Marrakech",
        codeExpedition: "EXP000000072",
        poidsReel: "3.4 kg",
        destinataire: "Omar Saidi",
        quantite: 3,
        prixUnitaire: 90,
        montantLigne: 270,
      },
      {
        idLigne: 1032,
        designation: "Envoi courrier simple - Agadir",
        codeExpedition: "EXP000000075",
        poidsReel: "0.6 kg",
        destinataire: "Salma Tazi",
        quantite: 2,
        prixUnitaire: 80,
        montantLigne: 160,
      },
    ],
  },
];

// ============================================================
// FONCTIONS D'ACCES
// ============================================================

// Facture par id (vue commercial)
export function getFactureMockById(id) {
  return FACTURES_MOCK.find((f) => String(f.idFacture) === String(id)) || null;
}

// Historique complet du client connecte, avec son nom reel injecte
export function getFacturesClient(nomClient) {
  return FACTURES_CLIENT.map((facture) => ({
    ...facture,
    clientRaisonSociale: nomClient,
  }));
}

// Une facture precise du client connecte, avec son nom reel injecte
export function getFactureClientById(id, nomClient) {
  const facture = FACTURES_CLIENT.find((f) => String(f.idFacture) === String(id));
  if (!facture) return null;

  return { ...facture, clientRaisonSociale: nomClient };
}