import { useEffect, useState } from "react";
import api from "../../services/api";
import Navbar from "../../components/layout/Navbar";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [ancien, setAncien] = useState("");
    const [nouveau, setNouveau] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => { api.get("/users/me").then((res) => setProfile(res.data)); }, []);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError(""); setMessage("");
        try {
            const res = await api.put("/users/me/password", {
                ancienMotDePasse: ancien, nouveauMotDePasse: nouveau,
            });
            setMessage(res.data);
            setAncien(""); setNouveau("");
        } catch (err) {
            setError(err.response?.data?.message || "Erreur");
        }
    };

    return (
        <>
            <Navbar />
            <div style={{ display: "flex", justifyContent: "center", padding: "var(--space-xl) var(--space-md)" }}>
                <Card title="Mon profil" style={{ width: "100%", maxWidth: 420 }}>
                    {!profile ? (
                        <p>Chargement...</p>
                    ) : (
                        <>
                            <p><strong>Identifiant :</strong> {profile.identifiant}</p>
                            <p><strong>Email :</strong> {profile.email}</p>
                            <p><strong>Rôle :</strong> {profile.role}</p>

                            <h3 style={{ marginTop: 24, marginBottom: 12 }}>Changer le mot de passe</h3>
                            <form onSubmit={handlePasswordChange}>
                                <Input label="Ancien mot de passe" type="password" value={ancien}
                                       onChange={(e) => setAncien(e.target.value)} required />
                                <Input label="Nouveau mot de passe" type="password" value={nouveau}
                                       onChange={(e) => setNouveau(e.target.value)} required />
                                {error && <p style={{ color: "var(--color-status-danger)", fontSize: 13 }}>{error}</p>}
                                {message && <p style={{ color: "var(--color-status-success)", fontSize: 13 }}>{message}</p>}
                                <Button type="submit">Mettre à jour</Button>
                            </form>
                        </>
                    )}
                </Card>
            </div>
        </>
    );
}