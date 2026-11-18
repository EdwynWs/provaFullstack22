import { Nunito } from "next/font/google";
import "./globals.css";
import "../public/template/css/sb-admin-2.min.css";
import "../public/template/css/fontawesome-free/css/all.min.css";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "./tarefas/context/userContext";
import Script from "next/script";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata = {
    title: "Prova Full Stack II - Kanban",
    description: "Projeto de estudo da prova prática de Full Stack II",
};

export default function RootLayout({ children }) {
    return (
        <html lang="pt-br" className={nunito.className}>
            <head>
                <Script strategy="beforeInteractive" src="/template/js/jquery.min.js" />
                <Script strategy="beforeInteractive" src="/template/js/bootstrap.bundle.min.js" />
                <Script strategy="beforeInteractive" src="/template/js/sb-admin-2.min.js" />
            </head>
            <body>
                <UserProvider>
                    <Toaster position="top-right" />
                    {children}
                </UserProvider>
            </body>
        </html>
    );
}
