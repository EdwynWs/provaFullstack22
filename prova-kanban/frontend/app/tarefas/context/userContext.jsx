'use client'
import { createContext, useEffect, useState } from "react";
import ApiClient from "@/utils/apiClient";
import Loading from "../../components/loading";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    async function carregarUsuario() {
        try {
            // Backend da prova: GET /auth/cookie (no projeto do professor era login/usuario).
            let response = await ApiClient.get("auth/cookie");
            setUsuario(response || null);
        } catch (erro) {
            console.error("Erro ao carregar usuário:", erro);
            setUsuario(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarUsuario();
    }, []);

    return (
        <UserContext.Provider value={{ usuario, setUsuario }}>
            {loading ? <Loading /> : children}
        </UserContext.Provider>
    );
};

export default UserContext;
