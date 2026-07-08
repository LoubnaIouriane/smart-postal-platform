import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function LoginForm({ onSubmit, loading, error }) {
    const [identifiant, setIdentifiant] = useState("");
    const [motDePasse, setMotDePasse] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(identifiant, motDePasse);
    };

    return (
        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 360 }}>
            <h2 style={{ marginBottom: 24 }}>Connexion</h2>

            <Input
                label="Identifiant"
                type="text"
                value={identifiant}
                onChange={(e) => setIdentifiant(e.target.value)}
                required
            />

            <Input
                label="Mot de passe"
                type="password"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                required
            />

            {error && (
                <p style={{ color: "var(--color-status-danger)", fontSize: 13, marginBottom: 12 }}>
                    {error}
                </p>
            )}

            <Button type="submit" disabled={loading}>
                {loading ? "Connexion..." : "Se connecter"}
            </Button>
        </form>
    );
}