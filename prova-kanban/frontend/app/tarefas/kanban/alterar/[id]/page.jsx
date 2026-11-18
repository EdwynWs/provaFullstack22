'use client'
import FormTarefa from "@/app/components/formTarefa";
import Loading from "@/app/components/loading";
import ApiClient from "@/utils/apiClient";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// Mesma estrutura de admin/imovel/alterar/[id]/page.jsx do código do professor.
export default function AlterarPage() {
    const { id } = useParams();
    const [tarefa, setTarefa] = useState(null);
    const [loading, setLoading] = useState(true);

    async function carregarTarefa() {
        try {
            let response = await ApiClient.get("tarefas/" + id);
            if (response) setTarefa(response);
        } catch (erro) {
            console.error("Erro ao buscar tarefa:", erro);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (id) carregarTarefa();
    }, [id]);

    return (
        <div>
            <h1 className="h3 mb-4 text-gray-800">Alterar tarefa #{id}</h1>
            {loading ? <Loading /> : tarefa ?
                <FormTarefa tarefa={tarefa} />
            :
                <div className="alert alert-danger">Não foi possível localizar esta tarefa.</div>
            }
        </div>
    );
}
