'use client'
import ApiClient from "@/utils/apiClient";
import Loading from "@/app/components/loading";
import Link from "next/link";
import { useEffect, useState } from "react";

const COLUNAS = [
    { chave: "a_fazer", titulo: "A fazer", cor: "primary", icone: "fa-list" },
    { chave: "em_andamento", titulo: "Em andamento", cor: "warning", icone: "fa-spinner" },
    { chave: "em_revisao", titulo: "Em revisão", cor: "info", icone: "fa-search" },
    { chave: "concluido", titulo: "Concluído", cor: "success", icone: "fa-check" }
];

export default function DashboardPage() {
    const [resumo, setResumo] = useState({
        a_fazer: 0, em_andamento: 0, em_revisao: 0, concluido: 0
    });
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(false);

    async function carregarResumo() {
        try {
            // O backend disponibiliza esta rota própria para as contagens.
            let response = await ApiClient.get("tarefas/resumo");
            if (response) {
                setResumo(response);
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

    useEffect(() => {
        carregarResumo();
    }, []);

    let total = COLUNAS.reduce((soma, item) => soma + Number(resumo[item.chave] || 0), 0);

    return (
        <div>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
                <Link href="/tarefas/quadro" className="btn btn-primary"><i className="fas fa-columns"></i> Abrir Quadro</Link>
            </div>
            {loading ? <Loading /> : erro ?
                <div className="alert alert-danger" role="alert">
                    Não foi possível carregar o resumo.
                    <button className="btn btn-sm btn-outline-danger ml-3" onClick={carregarResumo}>Tentar novamente</button>
                </div>
            :
                <div>
                    <div className="row">
                        {COLUNAS.map((item) => (
                            <div key={item.chave} className="col-xl-3 col-md-6 mb-4">
                                <div className={"card border-left-" + item.cor + " shadow h-100 py-2"}>
                                    <div className="card-body">
                                        <div className="row no-gutters align-items-center">
                                            <div className="col mr-2">
                                                <div className={"text-xs font-weight-bold text-" + item.cor + " text-uppercase mb-1"}>{item.titulo}</div>
                                                <div className="h5 mb-0 font-weight-bold text-gray-800">{resumo[item.chave] || 0}</div>
                                            </div>
                                            <div className="col-auto"><i className={"fas " + item.icone + " fa-2x text-gray-300"}></i></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="card shadow mb-4">
                        <div className="card-body">
                            <h2 className="h5 text-gray-800">Total de tarefas ativas: {total}</h2>
                            <p className="mb-0">Os valores vêm de <code>GET /tarefas/resumo</code>, e não de números fixos.</p>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}
