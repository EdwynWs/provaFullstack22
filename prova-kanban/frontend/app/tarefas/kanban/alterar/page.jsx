// A edição real deve receber o ID pela rota dinâmica /alterar/[id].
import { redirect } from "next/navigation";
export default function AlterarSemId() {
    redirect("/tarefas/kanban");
}
