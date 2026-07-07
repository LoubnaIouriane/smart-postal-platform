import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


export default function ProtectedRoute({
                                           children,
                                           allowedRoles
                                       }) {


    const {
        isAuthenticated,
        role
    } = useAuth();



    // Vérifier si l'utilisateur est connecté

    if (!isAuthenticated) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }



    // Vérifier le rôle

    if (
        allowedRoles &&
        !allowedRoles.includes(role)
    ) {

        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );

    }



    // Autoriser l'accès

    return children;

}