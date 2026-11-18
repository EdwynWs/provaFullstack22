'use client'
import Link from "next/link";
import { useContext } from "react";
import UserContext from "./context/userContext";

// O layout é compartilhado por Dashboard, Quadro e Gerenciar Tarefas.
// No código enviado, ele estava repetido nas páginas de Kanban e Usuários.
export default function TarefasLayout({ children }) {
    const { usuario } = useContext(UserContext);

    return (
        <div id="wrapper">
            <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
                <Link className="sidebar-brand d-flex align-items-center justify-content-center" href="/tarefas">
                    <div className="sidebar-brand-icon rotate-n-15"><i className="fas fa-tasks"></i></div>
                    <div className="sidebar-brand-text mx-3">PFS <sup>2</sup></div>
                </Link>
                <hr className="sidebar-divider my-0" />
                <li className="nav-item">
                    <Link className="nav-link" href="/tarefas"><i className="fas fa-chart-bar"></i><span> Dashboard</span></Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" href="/tarefas/quadro"><i className="fas fa-columns"></i><span> Quadro Kanban</span></Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" href="/tarefas/kanban"><i className="fas fa-list"></i><span> Gerenciar Tarefas</span></Link>
                </li>
                <hr className="sidebar-divider" />
                <div className="sidebar-heading">Consulta</div>
                <li className="nav-item">
                    <Link className="nav-link" href="/tarefas/usuarios"><i className="fas fa-users"></i><span> Usuários</span></Link>
                </li>
                <hr className="sidebar-divider d-none d-md-block" />
                <li className="nav-item">
                    <Link className="nav-link" href="/login"><i className="fas fa-sign-in-alt"></i><span> Trocar usuário</span></Link>
                </li>
            </ul>

            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                        <span className="navbar-text text-gray-700 font-weight-bold">Organizador de Tarefas</span>
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <span className="nav-link text-gray-700">
                                    <i className="fas fa-user-circle"></i> {usuario?.nome || "Usuário"}
                                </span>
                            </li>
                        </ul>
                    </nav>
                    <main className="container-fluid" style={{ minHeight: 650 }}>
                        {children}
                    </main>
                </div>
                <footer className="sticky-footer bg-white">
                    <div className="container my-auto">
                        <div className="copyright text-center my-auto">Projeto de estudo • Full Stack II</div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
