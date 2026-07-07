import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";
import { useAuth } from "../../context/AuthContext";


export default function Login() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();


    const handleLogin = async (identifiant, motDePasse) => {

        setLoading(true);
        setError("");

        try {

            const data = await login(
                identifiant,
                motDePasse
            );


            console.log("Login réussi :", data);



            switch(data.role) {

                case "CLIENT":
                    navigate("/dashboard");
                    break;


                case "COMMERCIAL":
                    navigate("/dashboard");
                    break;


                case "FACTEUR":
                    navigate("/dashboard");
                    break;


                default:
                    navigate("/login");
            }



        } catch(error) {

            console.error(
                "Erreur login :",
                error
            );


            setError(
                error.response?.data?.message ||
                "Identifiant ou mot de passe incorrect"
            );


        } finally {

            setLoading(false);

        }

    };



    return (

        <div
            style={{
                minHeight:"100vh",
                display:"flex",
                flexDirection:"column",
                alignItems:"center",
                justifyContent:"center",
                background:"var(--color-bg)"
            }}
        >


            <LoginForm
                onSubmit={handleLogin}
                loading={loading}
                error={error}
            />



            <p
                style={{
                    marginTop:"var(--space-md)",
                    fontSize:"14px",
                    color:"var(--color-text-muted)"
                }}
            >

                Pas encore de compte ?{" "}


                <Link
                    to="/pre-inscription"
                    style={{
                        color:"var(--color-primary)",
                        fontWeight:600
                    }}
                >
                    S'inscrire
                </Link>


            </p>


        </div>

    );

}