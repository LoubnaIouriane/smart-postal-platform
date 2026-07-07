import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [motDePasse, setMotDePasse] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await api.post("/auth/reset-password", { token, nouveauMotDePasse: motDePasse });
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Erreur");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: 360, margin: "60px auto" }}>
            <h2>Nouveau mot de passe</h2>
            <input
                type="password"
                placeholder="Nouveau mot de passe"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                required
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button type="submit">Valider</button>
        </form>
    );
}