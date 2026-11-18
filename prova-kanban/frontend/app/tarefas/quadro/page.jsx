'use client'
import CardTarefa from "@/app/components/cardTarefa";
import Loading from "@/app/components/loading";
import ApiClient from "@/utils/apiClient";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const COLUNAS = [
    { chave: "a_fazer", titulo: "A fazer", cor: "primary" },
    { chave: "em_andamento", titulo: "Em andamento", cor: "warning" },
    { chave: "em_revisao", titulo: "Em revisão", cor: "info" },
    { chave: "concluido", titulo: "Concluído", cor: "success" }
];

export default function QuadroKanbanPage() {
    const [tarefas, setTarefas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(false);
    const [movendo, setMovendo] = useState(false);
    const [arrastando, setArrastando] = useState(null);

    async function carregarTarefas() {
        try {
            let response = await ApiClient.get("tarefas");
            if (Array.isArray(response)) {
                setTarefas(response);
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

    async function moverTarefa(id, novoStatus) {
        // O PATCH recebe apenas o novo status, sem os demais campos da tarefa.
        let tarefa = tarefas.find((item) => item.id === id);
        if (!tarefa || tarefa.status === novoStatus || movendo) return;
        if (!COLUNAS.some((coluna) => coluna.chave === novoStatus)) return;

        setMovendo(true);
        try {
            let response = await ApiClient.patch("tarefas/" + id + "/status", {
                status: novoStatus
            });
            if (response) {
                toast.success(response.msg || "Tarefa movimentada");
                // Atualiza as colunas sem precisar recarregar a página.
                setTarefas((anteriores) => anteriores.map((item) =>
                    item.id === id ? { ...item, status: novoStatus } : item
                ));
            }
        } catch (erro) {
            console.error(erro);
            toast.error("Não foi possível mover a tarefa");
        } finally {
            setMovendo(false);
        }
    }

    async function soltarTarefa(event, novoStatus) {
        event.preventDefault();
        if (arrastando !== null) {
            await moverTarefa(arrastando, novoStatus);
        }
        setArrastando(null);
    }

    useEffect(() => {
        carregarTarefas();
    }, []);

    return (
        <div>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Quadro Kanban</h1>
                <Link href="/tarefas/kanban/cadastrar" className="btn btn-primary">
                    <i className="fas fa-plus"></i> Nova tarefa
                </Link>
            </div>
            <p className="text-muted small">
                Arraste um card para outra coluna ou use as setas do próprio card.
                Cada movimentação é salva em <code>PATCH /tarefas/:id/status</code>.
            </p>

            {loading ? <Loading /> : erro ?
                <div className="alert alert-danger" role="alert">
                    Erro ao carregar o quadro.
                    <button className="btn btn-sm btn-outline-danger ml-3" onClick={carregarTarefas}>Tentar novamente</button>
                </div>
            :
                <div className="quadro-scroll">
                    <div className="quadro-kanban">
                        {COLUNAS.map((coluna) => {
                            // filter distribui as tarefas pelo status; map exibe os cards.
                            let tarefasColuna = tarefas.filter((item) => item.status === coluna.chave);
                            return (
                                <section
                                    key={coluna.chave}
                                    className={"kanban-coluna border-top-" + coluna.cor}
                                    onDragOver={(event) => event.preventDefault()}
                                    onDrop={(event) => soltarTarefa(event, coluna.chave)}
                                >
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <h2 className="h6 font-weight-bold text-gray-800 mb-0">{coluna.titulo}</h2>
                                        <span className={"badge badge-" + coluna.cor}>{tarefasColuna.length}</span>
                                    </div>
                                    {tarefasColuna.length > 0 ?
                                        tarefasColuna.map((tarefa) => (
                                            <CardTarefa
                                                key={tarefa.id}
                                                tarefa={tarefa}
                                                mover={moverTarefa}
                                                onArrastar={setArrastando}
                                                movendo={movendo}
                                            />
                                        ))
                                    : <p className="small text-muted text-center kanban-vazio">Nenhuma tarefa nesta coluna</p>}
                                </section>
                            );
                        })}
                    </div>
                </div>
            }
        </div>
    );
}
