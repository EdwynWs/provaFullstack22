'use client'
import Loading from "@/app/components/loading";
import ApiClient from "@/utils/apiClient";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const STATUS = {
    a_fazer: "A fazer",
    em_andamento: "Em andamento",
    em_revisao: "Em revisão",
    concluido: "Concluído"
};

export default function GerenciarTarefasPage() {
    const [lista, setLista] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(false);

    async function carregar() {
        try {
            let response = await ApiClient.get("tarefas");
            if (Array.isArray(response)) {
                setLista(response);
                setErro(false);
            } else {
                setErro(true);
            }
        } catch (erro) {
            console.error(erro);
            setErro(true);
        } finally {
            setLoading(false);
        }
    }

    async function excluir(id) {
        if (!window.confirm("Deseja realmente excluir a tarefa " + id + "?")) return;

        try {
            let resposta = await ApiClient.delete("tarefas/" + id);
            if (resposta) {
                toast.success(resposta.msg || "Tarefa excluída");
                await carregar();
            }
        } catch (erro) {
            console.error(erro);
            toast.error("Não foi possível excluir a tarefa");
        }
    }

    useEffect(() => {
        carregar();
    }, []);

    return (
        <div>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Gerenciar Tarefas</h1>
                <Link href="/tarefas/kanban/cadastrar" className="btn btn-primary">
                    <i className="fas fa-plus"></i> Cadastrar tarefa
                </Link>
            </div>

            {loading ? <Loading /> : erro ?
                <div className="alert alert-danger" role="alert">
                    Erro ao carregar tarefas.
                    <button className="btn btn-sm btn-outline-danger ml-3" onClick={carregar}>Tentar novamente</button>
                </div>
            : lista.length > 0 ?
                <div className="card shadow mb-4">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>ID</th><th>Título</th><th>Descrição</th>
                                        <th>Status</th><th>Data limite</th><th>Responsável</th><th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lista.map((tarefa) => (
                                        <tr key={tarefa.id}>
                                            <td>{tarefa.id}</td>
                                            <td>{tarefa.titulo}</td>
                                            <td>{tarefa.descricao}</td>
                                            <td>{STATUS[tarefa.status] || tarefa.status}</td>
                                            <td>{tarefa.dataLimite ? String(tarefa.dataLimite).slice(0, 10) : "-"}</td>
                                            <td>{tarefa.responsavel?.nome || "Sem responsável"}</td>
                                            <td className="text-nowrap">
                                                <Link href={"/tarefas/kanban/alterar/" + tarefa.id} className="btn btn-sm btn-primary mr-2" aria-label={"Alterar tarefa " + tarefa.id}>
                                                    <i className="fas fa-pen"></i>
                                                </Link>
                                                <button type="button" onClick={() => excluir(tarefa.id)} className="btn btn-sm btn-danger" aria-label={"Excluir tarefa " + tarefa.id}>
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            : <div className="alert alert-info">Nenhuma tarefa cadastrada.</div>}
        </div>
    );
}
