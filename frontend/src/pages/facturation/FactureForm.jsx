import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createFacture } from "../../services/factureApi";

export default function FactureForm() {
  const navigate = useNavigate();
  const [clientId, setClientId] = useState("");
  const [clientRaisonSociale, setClientRaisonSociale] = useState("");
  const [tauxTVA, setTauxTVA] = useState(20);
  const [tauxRemise, setTauxRemise] = useState(0);
  const [lignes, setLignes] = useState([{ designation: "", quantite: 1, prixUnitaire: 0 }]);
  const [error, setError] = useState("");

  const updateLigne = (index, field, value) => {
    const copy = [...lignes];
    copy[index][field] = field === "designation" ? value : Number(value);
    setLignes(copy);
  };

  const ajouterLigne = () =>
    setLignes([...lignes, { designation: "", quantite: 1, prixUnitaire: 0 }]);

  const supprimerLigne = (index) =>
    setLignes(lignes.filter((_, currentIndex) => currentIndex !== index));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const facture = await createFacture({
        clientId: Number(clientId),
        clientRaisonSociale,
        clientIdentifiant: String(clientId),
        tauxTVA: Number(tauxTVA),
        tauxRemise: Number(tauxRemise),
        lignes,
      });
      navigate(`/commercial/factures/${facture.idFacture}`);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la creation.");
    }
  };

  return (
    <main className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Commercial</p>
          <h1>Nouvelle facture</h1>
        </div>
      </div>

      <form className="invoice-form" onSubmit={handleSubmit}>
        <label>
          ID Client
          <input value={clientId} onChange={(event) => setClientId(event.target.value)} required />
        </label>
        <label>
          Raison sociale
          <input
            value={clientRaisonSociale}
            onChange={(event) => setClientRaisonSociale(event.target.value)}
            placeholder="Atlas Logistics"
          />
        </label>
        <label>
          Taux TVA (%)
          <input type="number" value={tauxTVA} onChange={(event) => setTauxTVA(event.target.value)} required />
        </label>
        <label>
          Taux de remise (%)
          <input type="number" value={tauxRemise} onChange={(event) => setTauxRemise(event.target.value)} />
        </label>

        <h2>Lignes de facture</h2>
        {lignes.map((ligne, index) => (
          <div className="line-row" key={index}>
            <input
              placeholder="Designation"
              value={ligne.designation}
              onChange={(event) => updateLigne(index, "designation", event.target.value)}
              required
            />
            <input
              type="number"
              min="1"
              placeholder="Qte"
              value={ligne.quantite}
              onChange={(event) => updateLigne(index, "quantite", event.target.value)}
              required
            />
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Prix unitaire"
              value={ligne.prixUnitaire}
              onChange={(event) => updateLigne(index, "prixUnitaire", event.target.value)}
              required
            />
            <button type="button" className="btn btn-ghost" onClick={() => supprimerLigne(index)} disabled={lignes.length === 1}>
              Supprimer
            </button>
          </div>
        ))}

        <button type="button" className="btn btn-secondary" onClick={ajouterLigne}>
          + Ajouter une ligne
        </button>

        {error && <p className="alert-error">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Creer la facture</button>
        </div>
      </form>
    </main>
  );
}
