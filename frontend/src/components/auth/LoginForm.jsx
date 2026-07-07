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
        <form
            onSubmit={handleSubmit}
            className="card-surface login-form"
        >
            <h2 className="login-title">Connexion</h2>

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
                <p className="error-text">
                    {error}
                </p>
            )}

            <Button type="submit" disabled={loading}>
                {loading ? "Connexion..." : "Se connecter"}
            </Button>
        </form>
    );
}