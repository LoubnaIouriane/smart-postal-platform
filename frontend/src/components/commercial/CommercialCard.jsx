import Card from "../ui/Card";
import StatusBadge from "../ui/StatusBadge";


function CommercialCard({commercial}){

    return (

        <Card>

            <h2>
                {commercial.nom} {commercial.prenom}
            </h2>

            <p>
                Email : {commercial.email}
            </p>

            <StatusBadge
                status={commercial.statut}
            />

        </Card>

    );

}


export default CommercialCard;