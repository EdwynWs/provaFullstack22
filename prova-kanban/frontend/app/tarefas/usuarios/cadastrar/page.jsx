// A API entregue na prova tem GET /usuarios, mas não tem POST /usuarios.
// Evitamos oferecer um formulário de cadastro inexistente.
import { redirect } from "next/navigation";
export default function CadastroUsuariosIndisponivel() {
    redirect("/tarefas/usuarios");
}
