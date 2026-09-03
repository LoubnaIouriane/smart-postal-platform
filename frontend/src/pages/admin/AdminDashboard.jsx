import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import { adminService } from "../../services/adminService";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";

// ===================== DONNEES FICTIVES (frontend uniquement) =====================
// Generees une seule fois au chargement (useState avec fonction), stables tant que
// la page n'est pas rechargee. A remplacer par de vraies donnees backend plus tard.
function genererDonneesFictives() {
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const mois = ["Mars", "Avril", "Mai", "Juin", "Juillet", "Août"];
  const lineData = mois.map((m) => ({ mois: m, valeur: rand(8, 55) }));

  const barExpeditions = [
    { statut: "EN_ATTENTE", valeur: rand(5, 30) },
    { statut: "COLLECTEE", valeur: rand(10, 60) },
    { statut: "ANNULEE", valeur: rand(1, 10) },
  ];

  return {
    activiteAujourdHui: rand(0, 6),
    activiteCetteSemaine: rand(6, 25),
    activiteCeMois: rand(25, 90),
    lineData,
    barExpeditions,
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [agences, setAgences] = useState([]);
  const [mock] = useState(() => genererDonneesFictives()); // stable, pas regenere a chaque re-render

  useEffect(() => {
    adminService.getStats().then(setStats).catch(() => setStats(null));
    adminService.getAgences().then(setAgences).catch(() => setAgences([]));
  }, []);

  const cards = [
    { label: "Clients", value: stats?.nombreClients, to: null },
    { label: "Commerciaux", value: stats?.nombreCommerciaux, to: "/admin/commerciaux" },
    { label: "Facteurs", value: stats?.nombreFacteurs, to: "/admin/facteurs" },
    { label: "Agences", value: stats?.nombreAgences, to: "/admin/agences" },
  ];

  // ---- Agences par ville : donnees REELLES via adminService.getAgences() ----
  const agencesParVille = {};
  agences.forEach((a) => {
    const ville = a.nomVille || "Non renseignée";
    agencesParVille[ville] = (agencesParVille[ville] || 0) + 1;
  });
  const barAgencesParVille = Object.entries(agencesParVille).map(([ville, valeur]) => ({ ville, valeur }));

  return (
    <AdminLayout>
      <h1>Tableau de bord</h1>
      <p className="page-subtitle">Vue d'ensemble de la plateforme Smart Postal Platform</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 18, marginBottom: 32 }}>
        {cards.map((c) => {
          const content = (
            <div className="stat-card" key={c.label}>
              <div className="stat-label">{c.label}</div>
              <div className="stat-value">{c.value ?? "…"}</div>
            </div>
          );
          return c.to ? (
            <Link key={c.label} to={c.to} style={{ textDecoration: "none" }}>{content}</Link>
          ) : content;
        })}
      </div>

      {/* ---- Activite (mock) ---- */}
      <h3 style={{ marginBottom: 12 }}>Activité</h3>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
        <PerfCard label="Aujourd'hui" value={mock.activiteAujourdHui} suffix=" pré-inscriptions" />
        <PerfCard label="Cette semaine" value={mock.activiteCetteSemaine} suffix=" pré-inscriptions" />
        <PerfCard label="Ce mois" value={mock.activiteCeMois} suffix=" pré-inscriptions" />
      </div>

      {/* ---- Graphiques ---- */}
      <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginBottom: 32 }}>

        <div style={{ width: 460, height: 300 }}>
          <h3 style={{ marginBottom: 8 }}>Évolution des pré-inscriptions (par mois)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mock.lineData}>
              <XAxis dataKey="mois" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="valeur" stroke="#0B3D6B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ width: 420, height: 300 }}>
          <h3 style={{ marginBottom: 8 }}>Expéditions par statut</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mock.barExpeditions}>
              <XAxis dataKey="statut" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="valeur" fill="#F58220" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ width: 420, height: 300 }}>
          <h3 style={{ marginBottom: 8 }}>Agences par ville</h3>
          {barAgencesParVille.length === 0 ? (
            <p style={{ color: "#9098b0" }}>Aucune donnée disponible.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barAgencesParVille}>
                <XAxis dataKey="ville" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="valeur" fill="#2F9E63" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      
    </AdminLayout>
  );
}

function PerfCard({ label, value, suffix }) {
  return (
    <div className="stat-card" style={{ minWidth: 160 }}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value ?? "…"}{suffix}</div>
    </div>
  );
}