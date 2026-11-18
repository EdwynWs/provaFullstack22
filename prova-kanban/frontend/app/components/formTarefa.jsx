'use client'
import ApiClient from "@/utils/apiClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Loading from "./loading";

// Mesma ideia do FormImovel do professor: um componente para cadastrar e alterar.
// A prop "tarefa" é opcional; quando existe, estamos em modo de alteração.
export default function FormTarefa({ tarefa }) {
    const [alteracao, setAlteracao] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [loadingUsuarios, setLoadingUsuarios] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const router = useRouter();

    const titulo = useRef(null);
    const descricao = useRef(null);
    const status = useRef(null);
    const dataLimite = useRef(null);
    const responsavel = useRef(null);

    async function carregarUsuarios() {
        try {
            // O backend permite escolher o responsável usando GET /usuarios.
            let response = await ApiClient.get("usuarios");
            if (Array.isArray(response)) {
                setUsuarios(response);
            }
        } catch (erro) {
            console.error("Erro ao carregar usuários:", erro);
            toast.error("Não foi possível consultar os responsáveis");
        } finally {
            setLoadingUsuarios(false);
        }
    }

    useEffect(() => {
        carregarUsuarios();
    }, []);

    useEffect(() => {
        // Espera o select dos usuários existir antes de preencher os campos.
        if (tarefa && !loadingUsuarios) {
            titulo.current.value = tarefa.titulo || "";
            descricao.current.value = tarefa.descricao || "";
            status.current.value = tarefa.status || "a_fazer";
            dataLimite.current.value = String(tarefa.dataLimite || "").slice(0, 10);
            responsavel.current.value = tarefa.responsavel?.id
                ? String(tarefa.responsavel.id) : "";
            setAlteracao(true);
        }
    }, [tarefa, loadingUsuarios]);

    function obterDados() {
        // Nomes tirados do req.body em backend/controllers/tarefaController.js.
        let idResponsavel = responsavel.current.value;
        return {
            titulo: titulo.current.value.trim(),
            descricao: descricao.current.value.trim(),
            status: status.current.value,
            dataLimite: dataLimite.current.value,
            responsavel: idResponsavel ? { id: Number(idResponsavel) } : null
        };
    }

    function validar(dados) {
        if (!dados.titulo || !dados.descricao || !dados.status || !dados.dataLimite) {
            toast.error("Preencha título, descrição, status e data limite");
            return false;
        }
        return true;
    }

    async function gravar() {
        let dados = obterDados();
        if (!validar(dados)) return;

        setSalvando(true);
        try {
            // POST /tarefas espera JSON. NÃO usar postFormData do projeto de imóveis.
            let resposta = await ApiClient.post("tarefas", dados);
            if (resposta) {
                toast.success(resposta.msg || "Tarefa cadastrada!");
                router.push("/tarefas/kanban");
            }
        } catch (erro) {
            console.error(erro);
            toast.error("Não foi possível cadastrar a tarefa");
        } finally {
            setSalvando(false);
        }
    }

    async function alterar() {
        let dados = obterDados();
        if (!validar(dados) || !tarefa?.id) return;

        setSalvando(true);
        try {
            // O ID vai na rota: PUT /tarefas/:id, não no FormData.
            let resposta = await ApiClient.put("tarefas/" + tarefa.id, dados);
            if (resposta) {
                toast.success(resposta.msg || "Tarefa alterada!");
                router.push("/tarefas/kanban");
            }
        } catch (erro) {
            console.error(erro);
            toast.error("Não foi possível alterar a tarefa");
        } finally {
            setSalvando(false);
        }
    }

    if (loadingUsuarios) return <Loading />;

    return (
        <div className="card shadow mb-4">
            <div className="card-body">
                <div className="form-group">
                    <label htmlFor="titulo">Título</label>
                    <input ref={titulo} id="titulo" type="text" className="form-control" maxLength={150} />
                </div>
                <div className="form-group">
                    <label htmlFor="descricao">Descrição</label>
                    <textarea ref={descricao} id="descricao" rows={3} className="form-control"></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select ref={status} id="status" className="form-control" defaultValue="a_fazer">
                        <option value="a_fazer">A fazer</option>
                        <option value="em_andamento">Em andamento</option>
                        <option value="em_revisao">Em revisão</option>
                        <option value="concluido">Concluído</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="dataLimite">Data limite</label>
                    <input ref={dataLimite} id="dataLimite" type="date" className="form-control" />
                </div>
                <div className="form-group">
                    <label htmlFor="responsavel">Responsável</label>
                    <select ref={responsavel} id="responsavel" className="form-control" defaultValue="">
                        <option value="">Sem responsável</option>
                        {usuarios.map((usuario) => (
                            <option key={usuario.id} value={usuario.id}>{usuario.nome}</option>
                        ))}
                    </select>
                    <small className="form-text text-muted">Os usuários são buscados em GET /usuarios.</small>
                </div>
                <button type="button" disabled={salvando} onClick={alteracao ? alterar : gravar} className="btn btn-primary">
                    <i className="fas fa-check"></i> {salvando ? "Salvando..." : alteracao ? "Salvar alterações" : "Cadastrar tarefa"}
                </button>
                <Link href="/tarefas/kanban" className="btn btn-secondary ml-2">
                    <i className="fas fa-arrow-left"></i> Voltar
                </Link>
            </div>
        </div>
    );
}
