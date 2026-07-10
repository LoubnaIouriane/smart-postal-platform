import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [role, setRole] = useState(localStorage.getItem("role"));
    const [userId, setUserId] = useState(localStorage.getItem("userId"));

    async function login(identifiant, motDePasse) {
        const response = await api.post("/auth/login", { identifiant, motDePasse });
        const { token, role, userId } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("userId", userId);

        setToken(token);
        setRole(role);
        setUserId(userId);

        return response.data;
    }

    function logout() {
        localStorage.clear();
        setToken(null);
        setRole(null);
        setUserId(null);
    }

    const value = {
        token,
        role,
        userId,
        isAuthenticated: !!token,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}