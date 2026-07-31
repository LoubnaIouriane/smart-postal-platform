import { useAuth } from "../../context/AuthContext";

export default function Header({ title, description }) {

    const { role } = useAuth();

    return (
        <header className="commercial-header">

            <div className="header-title">
                <h1>{title}</h1>
                <p>{description}</p>
            </div>


            <div className="header-actions">

                <div className="notification-icon">
                    🔔
                </div>


                <div className="commercial-profile">

                    <div className="profile-avatar">
                        👤
                    </div>

                    <div className="profile-info">
                        <span>Commercial</span>
                        <small>{role}</small>
                    </div>

                </div>

            </div>

        </header>
    );
}