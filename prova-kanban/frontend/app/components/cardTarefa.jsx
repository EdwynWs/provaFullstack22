'use client'
import Link from "next/link";

const STATUS = ["a_fazer", "em_andamento", "em_revisao", "concluido"];

// Adaptação do CardImovel do código-fonte: agora exibe dados da tarefa,
// e disponibiliza botões para movimentar a tarefa entre as colunas.
export default function CardTarefa({ tarefa, mover, onArrastar, movendo }) {
    const posicao = STATUS.indexOf(tarefa.status);
    const anterior = posicao > 0 ? STATUS[posicao - 1] : null;
    const proximo = posicao >= 0 && posicao < STATUS.length - 1 ? STATUS[posicao + 1] : null;

    return (
        <div
            className="card shadow-sm mb-3 kanban-card"
            draggable={!movendo}
            onDragStart={() => onArrastar(tarefa.id)}
            aria-label={"Tarefa " + tarefa.titulo}
        >
            <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start">
                    <h3 className="h6 font-weight-bold text-gray-800 mb-2">{tarefa.titulo}</h3>
                    <span className="text-muted small">#{tarefa.id}</span>
                </div>
                <p className="small text-gray-700 mb-2">{tarefa.descricao}</p>
                <p className="small text-muted mb-1">
                    <i className="fas fa-calendar-alt"></i>
                    {tarefa.dataLimite ? String(tarefa.dataLimite).slice(0, 10) : "Sem data"}
                </p>
                <p className="small text-muted mb-3">
                    <i className="fas fa-user"></i>
                    {tarefa.responsavel?.nome || "Sem responsável"}
                </p>
                <div className="d-flex align-items-center justify-content-between">
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        type="button"
                        disabled={!anterior || movendo}
                        onClick={() => mover(tarefa.id, anterior)}
                        title="Mover para coluna anterior"
                        aria-label="Mover para coluna anterior"
                    ><i className="fas fa-arrow-left"></i></button>
                    <Link className="btn btn-sm btn-outline-primary" href={"/tarefas/kanban/alterar/" + tarefa.id}>
                        <i className="fas fa-pen"></i> Editar
                    </Link>
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        type="button"
                        disabled={!proximo || movendo}
                        onClick={() => mover(tarefa.id, proximo)}
                        title="Mover para próxima coluna"
                        aria-label="Mover para próxima coluna"
                    ><i className="fas fa-arrow-right"></i></button>
                </div>
            </div>
        </div>
    );
}
