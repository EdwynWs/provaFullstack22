'use client'
import ApiClient from "@/utils/apiClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";


export default function FormImovel({tarefas}) {

    const [alteracao, setAlteracao] = useState(false);
    const [setTarefas] = useState([]);
    const router = useRouter();
    const titulo = useRef("");
    const descricao = useRef("");
    const status = useRef("");
    const dataLimite = useRef("");
    const responsavel  = useRef("");


    async function carregarKanban() {
        let response = await ApiClient.get("tarefas");
        if(response){
            setTarefas(response)
        }
    }

    async function gravar() {
        //valida os campos
        if(
            titulo.current.value != "" &&
            descricao.current.value != "" &&
            status.current.value != "" &&
            dataLimite.current.value != "" &&
            responsavel.current.value != "" 
        ){

            //cria o form data para enviar ao backend
            let dados = {
            titulo: titulo.current.value,
            descricao: descricao.current.value,
            status: status.current.value,
            dataLimite: dataLimite.current.value,
            responsavel: {
                id: Number(responsavel.current.value)
            }
        };

            //fazer o fetch
            console.log("DADOS ENVIADOS:", dados);
            let resposta = await ApiClient.post("tarefas", dados);
            if(resposta) {
                toast.success(resposta.msg);
                //navega para a listagem
                router.back();
            }
        }
        else {
            toast.error("Preencha corretamente os campos do formulário");
        }
    }

    async function alterar() {
        //valida os campos
        if(titulo.current.value != "" &&
            descricao.current.value != "" &&
            status.current.value != "" &&
            dataLimite.current.value != "" &&
            responsavel.current.value != "") {

            //cria o form data para enviar ao backend
            let formData = new FormData();
            formData.append("id", tarefas.id);
            formData.append("titulo", titulo.current.value);
            formData.append("descricao", descricao.current.value);
            formData.append("status", status.current.value);
            formData.append("dataLimite", dataLimite.current.value);
            formData.append("responsavel", responsavel.current.value);

            //fazer o fetch
            let response = await ApiClient.putFormData("tarefas", formData);
            if(response) {
                toast.success(response.msg)
                //navega para a listagem
                router.back();
            }
        }
        else {
            toast.error("Preencha corretamente os campos do formulário");
        }
    }

    useEffect(() => {
        //se diferente de null, estamos em alteração
        if(tarefas) {
            //troca o estado e preenche os ref's
            titulo.current.value = tarefas.titulo;
            descricao.current.value = tarefas.descricao;
            status.current.value = tarefas.status;
            dataLimite.current.value = tarefas.dataLimite;
            responsavel.current.value = tarefas.responsavel;
            setAlteracao(true);
        }
    }, [])

    return (
        <div>
            <div className="form-group">
                <label>Titulo</label>
                <input ref={titulo} type="text" className="form-control"></input>
            </div>

            <div className="form-group">
                <label>Descricao</label>
                <input ref={descricao} type="text" className="form-control"></input>
            </div>

            <div className="form-group">
                <label>Status</label>
                <input ref={status} type="text" className="form-control"></input>
            </div>

            <div className="form-group">
                <label>Data</label>
                <input ref={dataLimite} type="date" className="form-control"></input>
            </div>

            <div className="form-group">
                <label>Responsavel</label>
                <input ref={responsavel} type="decimal" className="form-control"></input>
            </div>

            <div>
                <button onClick={alteracao ? alterar : gravar} className="btn btn-primary"><i className="fas fa-check"></i> Confirmar</button>    
                <Link href="/tarefas/kanban" className="btn btn-default"><i className="fas fa-arrow-left"></i> Voltar</Link>
            </div> 
        </div>
    )
}