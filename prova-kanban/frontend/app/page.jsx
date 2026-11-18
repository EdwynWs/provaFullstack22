'use client'
import Link from "next/link";

export default function Home() {

  return (
    <div>
      <nav className="navbar navbar-expand navbar-light bg-primary topbar mb-4 static-top shadow">

        <ul className="navbar-nav ml-auto">

            <div className="topbar-divider d-none d-sm-block"></div>

            <li className="nav-item dropdown no-arrow">
                <Link href="/login" className="btn btn-outline-light">Login</Link>
            </li>

        </ul>
      </nav>
      <h1>Olá</h1>
    </div>
  );
}
