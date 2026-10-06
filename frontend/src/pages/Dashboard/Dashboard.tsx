import { useEffect, useState } from "react";
import CardDashboard from "../../components/CardDashboard/CardDashboard";
import Menu from "../../components/Menu/Menu";
import "./Dashboard.css"
import apagarToken from "../../services/deleteToken";

function Dashboard() {
    const [qtdProdutos, setQtdProdutos] = useState(0);
    const [qtdProdutosBaixo, setQtdProdutosBaixo] = useState(0)
    const [qtdVendas, setQtdVendas] = useState(0)

    const token = localStorage.getItem("token");

    return (
        <div className="container-dashboard">
            <Menu />
            <div className="content-dashboard">
                <header>
                    <div className="header-info">
                        <h2>Dashboard</h2>
                        <p>Controle de estoque e vendas.</p>
                    </div>
                </header>
                <main>
                </main>
            </div>
        </div>
    );
}
export default Dashboard;
