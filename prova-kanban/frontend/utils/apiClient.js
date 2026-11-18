import toast from "react-hot-toast";

const BASE_URL = "http://localhost:5000/";

// Mantidos os métodos estáticos usados pelo professor, com o PATCH exigido pelo Kanban.
export default class ApiClient {
    static async get(endpoint) {
        let response = await fetch(BASE_URL + endpoint, {
            method: "GET",
            credentials: "include"
        });
        return await this.checarResposta(response);
    }

    static async post(endpoint, body) {
        let response = await fetch(BASE_URL + endpoint, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        return await this.checarResposta(response);
    }

    static async put(endpoint, body) {
        let response = await fetch(BASE_URL + endpoint, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        return await this.checarResposta(response);
    }

    static async patch(endpoint, body) {
        let response = await fetch(BASE_URL + endpoint, {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        return await this.checarResposta(response);
    }

    static async delete(endpoint) {
        let response = await fetch(BASE_URL + endpoint, {
            method: "DELETE",
            credentials: "include"
        });
        return await this.checarResposta(response);
    }

    // Métodos do código-fonte do professor: úteis quando a API recebe arquivos,
    // mas NÃO devem ser usados para o cadastro e a edição da tarefa Kanban.
    static async postFormData(endpoint, formData) {
        let response = await fetch(BASE_URL + endpoint, {
            method: "POST",
            credentials: "include",
            body: formData
        });
        return await this.checarResposta(response);
    }

    static async putFormData(endpoint, formData) {
        let response = await fetch(BASE_URL + endpoint, {
            method: "PUT",
            credentials: "include",
            body: formData
        });
        return await this.checarResposta(response);
    }

    static async checarResposta(response) {
        let json = null;
        try {
            json = await response.json();
        } catch (erro) {
            // Algumas respostas podem não ter corpo JSON.
        }

        if (response.ok) {
            return json || {};
        }

        // GET /auth/cookie pode responder 401 quando ainda não há login.
        if (response.status !== 401) {
            toast.error(json?.msg || "Erro HTTP " + response.status);
        }
        return null;
    }
}
