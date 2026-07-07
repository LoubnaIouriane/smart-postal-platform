import { useAuth } from "../../context/AuthContext.jsx";
import { Link } from "react-router-dom";


export default function Dashboard() {

    const { role, logout } = useAuth();


    return (

        <div style={{ padding: 40 }}>


            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between"
                }}
            >

                <h1>
                    Tableau de bord — {role}
                </h1>


                <button onClick={logout}>
                    Se deconnecter
                </button>


            </div>



            {role === "CLIENT" && (

                <ul>

                    <li>
                        Nouvelle expedition
                    </li>


                    <li>
                        Mes expeditions
                    </li>


                    <li>
                        Mes factures
                    </li>


                    <li>
                        <Link
                            to="/profile"
                            style={{
                                cursor: "pointer",
                                textDecoration: "none",
                                color: "blue"
                            }}
                        >
                            Mon profil
                        </Link>
                    </li>


                </ul>

            )}




            {role === "COMMERCIAL" && (

                <ul>

                    <li>
                        Pre-inscriptions et validation des comptes
                    </li>


                    <li>
                        Grilles de remise
                    </li>


                    <li>
                        Liste des clients
                    </li>


                </ul>

            )}





            {role === "FACTEUR" && (

                <ul>

                    <li>
                        Liste des expeditions a collecter
                    </li>


                    <li>
                        Verification du poids reel
                    </li>


                    <li>
                        Validation de la collecte
                    </li>


                </ul>

            )}


        </div>

    );
}