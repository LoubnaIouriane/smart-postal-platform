import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [ancien, setAncien] = useState("");
    const [nouveau, setNouveau] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        api.get("/users/me").then((res) => setProfile(res.data));
    }, []);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError(""); setMessage("");
        try {
            const res = await api.put("/users/me/password", {
                ancienMotDePasse: ancien,
                nouveauMotDePasse: nouveau,
            });
            setMessage(res.data);
            setAncien(""); setNouveau("");
        } catch (err) {
            setError(err.response?.data?.message || "Erreur");
        }
    };

    if (!profile) return <p>Chargement...</p>;

    return (
        <div style={{ maxWidth: 420, margin: "40px auto" }}>
            <h2>Mon profil</h2>
            <p><strong>Identifiant :</strong> {profile.identifiant}</p>
            <p><strong>Email :</strong> {profile.email}</p>
            <p><strong>Role :</strong> {profile.role}</p>

            <h3>Changer le mot de passe</h3>
            <form onSubmit={handlePasswordChange}>
                <input
                    type="password" placeholder="Ancien mot de passe"
                    value={ancien} onChange={(e) => setAncien(e.target.value)} required
                />
                <input
                    type="password" placeholder="Nouveau mot de passe"
                    value={nouveau} onChange={(e) => setNouveau(e.target.value)} required
                />
                {error && <p style={{ color: "red" }}>{error}</p>}
                {message && <p style={{ color: "green" }}>{message}</p>}
                <button type="submit">Mettre a jour</button>
            </form>
        </div>
    );
}