'use client'
import { useRouter } from "next/navigation";
import { useContext, useRef } from "react"
import toast from "react-hot-toast";
import UserContext from "../tarefas/context/userContext";
import ApiClient from "@/utils/apiClient";


export default function LoginPage() {

    const email = useRef("");
    const senha = useRef("");
    const {setUsuario} = useContext(UserContext);

    const router = useRouter();

    async function logar() {
        //faz o fetch para o backend;
        if(email.current.value != "" && senha.current.value != "") {
            let response = await ApiClient.post("auth/login", {
                    email: email.current.value,
                    senha: senha.current.value
                })           
            if(response) {
                //autenticação realizada com sucesso
                setUsuario(response.usuario);
                router.replace("/tarefas");
            }
        }
        else {
            toast.error("Preencha o e-mail e a senha!");
        }
    }

    return (
        <div>
            <div className="container">
                <div className="row justify-content-center">

                    <div className="col-xl-10 col-lg-12 col-md-9">

                        <div className="card o-hidden border-0 shadow-lg my-5">
                            <div className="card-body p-0">
                                <div className="row">
                                    <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
                                    <div className="col-lg-6">
                                        <div className="p-5">
                                            <div className="text-center">
                                                <h1 className="h4 text-gray-900 mb-4">Faça o login abaixo</h1>
                                            </div>
                                            <form className="user">
                                                <div className="form-group">
                                                    <input ref={email} type="email" className="form-control form-control-user"
                                                        id="exampleInputEmail" aria-describedby="emailHelp"
                                                        placeholder="Insira o e-mail..." />
                                                </div>
                                                <div className="form-group">
                                                    <input ref={senha} type="password" className="form-control form-control-user"
                                                        id="exampleInputPassword" placeholder="Senha" />
                                                </div>
                                                <button onClick={logar} type="button" className="btn btn-primary btn-user btn-block">
                                                    Login
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}