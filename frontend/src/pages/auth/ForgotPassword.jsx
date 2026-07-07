import { useState } from "react";
import api from "../../services/api";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); setMessage("");
        try {
            const res = await api.post("/auth/forgot-password", { email });
            setMessage(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: 360, margin: "60px auto" }}>
            <h2>Mot de passe oublie</h2>
            <input
                type="email"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
            {message && <p style={{ color: "green" }}>{message}</p>}
            <button type="submit">Envoyer le lien</button>
        </form>
    );
}