import "../../styles/commercial-theme.css";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function CommercialLayout({ title, description, children }) {
    return (
        <div className="commercial-layout">
            <Sidebar />
            <div className="commercial-main">
                <Header title={title} description={description} />
                <main className="commercial-content">{children}</main>
            </div>
        </div>
    );
}