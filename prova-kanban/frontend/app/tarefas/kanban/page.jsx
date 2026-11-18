'use client'
import Loading from "@/app/components/loading";
import ApiClient from "@/utils/apiClient";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";


export default function HomeKanban() {

    const [lista, setLista] = useState([]);
    const [loading, setLoading] = useState(true);

    async function carregar() {
        let lista = await ApiClient.get("tarefas");
        if(lista) {   
            setLista(lista);
        }
        setLoading(false);

    }

    async function excluir(id) {
        let resposta = await ApiClient.delete("tarefas/" + id);
        if(resposta) {
            toast.success(resposta.msg);
            carregar();
        }
    }

    useEffect(() => {
        carregar();
    }, [])

    return (
        <div>
            
            <h1>Cadastros</h1>
            <div>
                <Link className="btn btn-primary" href="/tarefas/kanban/cadastrar"><i className="fas fa-plus"></i> Cadastrar </Link>
            </div>
            <br></br>
            <div>               
                {
                    loading ?
                    <Loading></Loading>
                    :
                    lista.length > 0 ?
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Titulo</th>
                                    <th>Descrição</th>
                                    <th>Status</th>
                                    <th>Data Limite</th>
                                    <th>Responsavel</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    lista.map((value, index) => {
                                        return <tr key={index}>
                                                    <td>{value.id}</td>
                                                    <td>{value.titulo}</td>
                                                    <td>{value.descricao}</td>
                                                    <td>{value.status}</td>
                                                    <td>{value.dataLimite}</td>
                                                    <td>{value.responsavel?.nome}</td>
                                                    
                                    <td>
                                        <Link href={"/tarefas/kanban/alterar/" + value.id} className="btn btn-primary"><i className="fas fa-pen"></i></Link>
                                        <button onClick={() => excluir(value.id)} className="btn btn-danger"><i className="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    :
                    <div><h3>Nenhum cadastrado!</h3></div>
                }
            </div>
        </div>
        
    )
}