import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import CommercialLayout from "../../components/commercial/CommercialLayout";

import {
    getDashboardStatistiques,
    getPreInscriptions
} from "../../services/commercialApi";



export default function CommercialDashboard() {


    const navigate = useNavigate();



    const [stats, setStats] = useState({

        nombreClients:0,

        nombreContrats:0,

        demandesEnAttente:0

    });



    const [notifications,setNotifications] = useState(0);





    useEffect(()=>{


        getDashboardStatistiques()

            .then(setStats)

            .catch(console.error);




        getPreInscriptions()

            .then(data=>{

                setNotifications(data.length);

            })

            .catch(console.error);



    },[]);







    return (

        <CommercialLayout

            title="Dashboard Commercial"

            description="Vue générale de votre activité"

        >





            {
                notifications > 0 &&

                <div

                    onClick={() =>
                        navigate("/commercial/preinscriptions")
                    }


                    style={{

                        background:"#fff3cd",

                        padding:"15px",

                        borderRadius:"8px",

                        marginBottom:"25px",

                        cursor:"pointer",

                        fontWeight:"bold"

                    }}

                >

                    🔔 {notifications} nouvelle(s) demande(s) de pré-inscription à valider


                </div>


            }









            <div className="commercial-stat-grid">





                <div

                    className="commercial-stat-card"

                    onClick={() =>
                        navigate("/commercial/clients")
                    }

                    style={{cursor:"pointer"}}

                >

                    <h3>

                        Clients

                    </h3>


                    <h1>

                        {stats.nombreClients}

                    </h1>


                </div>







                <div

                    className="commercial-stat-card"

                    onClick={() =>
                        navigate("/commercial/contrats")
                    }

                    style={{cursor:"pointer"}}

                >


                    <h3>

                        Contrats

                    </h3>


                    <h1>

                        {stats.nombreContrats}

                    </h1>


                </div>







                <div

                    className="commercial-stat-card"

                    onClick={() =>
                        navigate("/commercial/preinscriptions")
                    }

                    style={{cursor:"pointer"}}

                >


                    <h3>

                        Pré-inscriptions

                    </h3>


                    <h1>

                        {stats.demandesEnAttente}

                    </h1>


                </div>






            </div>







            <div

                style={{

                    marginTop:40,

                    display:"grid",

                    gridTemplateColumns:
                        "repeat(auto-fit,minmax(230px,1fr))",

                    gap:20

                }}

            >




                <button

                    className="commercial-btn-add"

                    onClick={() =>
                        navigate("/commercial/clients")
                    }

                >

                    👥 Gérer les clients

                </button>






                <button

                    className="commercial-btn-add"

                    onClick={() =>
                        navigate("/commercial/preinscriptions")
                    }

                >

                    📝 Valider les pré-inscriptions

                </button>






                <button

                    className="commercial-btn-add"

                    onClick={() =>
                        navigate("/commercial/contrats")
                    }

                >

                    📄 Gérer les contrats

                </button>






                <button

                    className="commercial-btn-add"

                    onClick={() =>
                        navigate("/commercial/grilles-remise")
                    }

                >

                    💳 Gérer les remises

                </button>



            </div>




        </CommercialLayout>


    );


}