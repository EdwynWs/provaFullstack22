'use client'
import ApiClient from "@/utils/apiClient";
import Loading from "@/app/components/loading";
import { useEffect, useState } from "react";

export default function UsuariosPage() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(false);

    async function carregarUsuarios() {
        try {
            let response = await ApiClient.get("usuarios");
            if (Array.isArray(response)) setUsuarios(response);
            else setErro(true);
        } catch (erro) {
            console.error(erro);
            setErro(true);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarUsuarios();
    }, []);

    return (
        <div>
            <h1 className="h3 mb-4 text-gray-800">Usuários disponíveis</h1>
            <p className="text-muted">Estes usuários podem ser selecionados como responsáveis por tarefas.</p>
            {loading ? <Loading /> : erro ?
                <div className="alert alert-danger">Não foi possível consultar usuários.</div>
            : usuarios.length > 0 ?
                <div className="card shadow"><div className="card-body">
                    <table className="table table-striped">
                        <thead><tr><th>ID</th><th>Nome</th><th>E-mail</th></tr></thead>
                        <tbody>
                            {usuarios.map((usuario) => (
                                <tr key={usuario.id}>
                                    <td>{usuario.id}</td>
                                    <td>{usuario.nome}</td>
                                    <td>{usuario.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div></div>
            : <div className="alert alert-info">Nenhum usuário disponível.</div>}
        </div>
    );
}
