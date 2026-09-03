import { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import ExpeditionForm from "../../components/expedition/ExpeditionForm";
import ExpeditionList from "../../components/expedition/ExpeditionList";

export default function ExpeditionPage() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleCreated = () => {
        setRefreshTrigger((prev) => prev + 1);
    };

    return (
        <>
            <Navbar />
            <div style={{ display: "flex", gap: "24px", padding: "24px", flexWrap: "wrap" }}>
                <ExpeditionForm onCreated={handleCreated} />
                <div style={{ flex: 1, minWidth: "400px" }}>
                    <ExpeditionList refreshTrigger={refreshTrigger} />
                </div>
            </div>
        </>
    );
}