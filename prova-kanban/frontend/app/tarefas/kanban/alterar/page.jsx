'use client'
import FormTarefa from "@/app/components/formTarefa";
import Loading from "@/app/components/loading";
import ApiClient from "@/utils/apiClient";
import { useParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import toast from "react-hot-toast";


export default function AlterarPage({ params }) {
    const {id} = use(params);
    const [imovel, setImovel] = useState(null);
    const [loading, setLoading] = useState(true);

    async function carregar() {
        //busca as informações do imóvel via fetch

        let response = await ApiClient.get("tarefas/" + id);
        if(response) {
            setImovel(response);
        }

        setLoading(false);
    }

    useEffect(() => {
        carregar();
    }, [])

    return (
        <div>
            <h1>Alterar</h1>

            {
                loading ? 
                <Loading></Loading>
                :
                imovel ?
                <FormTarefa tarefas={tarefas}></FormTarefa>
                :
                <div>Erro ao carregar!</div>
            }
        </div>
    )
}