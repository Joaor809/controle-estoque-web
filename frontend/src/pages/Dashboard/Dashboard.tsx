import { useEffect, useState } from "react";
import CardDashboard from "../../components/CardDashboard/CardDashboard";
import Menu from "../../components/Menu/Menu";
import "./Dashboard.css"
function Dashboard() {
    const [qtdProdutos, setQtdProdutos] = useState(0);
    const [qtdProdutosBaixo, setQtdProdutosBaixo] = useState(0)
    const [qtdVendas, setQtdVendas] = useState(0)

    const token = localStorage.getItem("token");

    async function buscarQtdProdutos() {
        const response = await fetch("http://localhost:3000/qtdProdutos", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await response.json();
        setQtdProdutos(data);
    }
    async function buscarQtdProdutosBaixo() {
        const response = await fetch("http://localhost:3000/qtdProdutosBaixa", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await response.json()
        setQtdProdutosBaixo(data)
    }
    async function buscarQtdVendas(){
        const response = await fetch("http://localhost:3000/qtdVendas", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await response.json()
        setQtdVendas(data)
    }

    useEffect(() => {
        buscarQtdProdutos();
        buscarQtdProdutosBaixo();
        buscarQtdVendas();
    }, []);
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
                    <div className="cards-container">
                        <CardDashboard icon="bi bi-box-seam" cardName="Produtos" countInfo={qtdProdutos} />
                        <CardDashboard icon="bi bi-exclamation-triangle" cardName="Estoque baixo" countInfo={qtdProdutosBaixo}/>
                        <CardDashboard icon="bi bi-cart" cardName="Vendas" countInfo={qtdVendas} />
                    </div>
                </main>
            </div>
        </div>
    );
}
export default Dashboard;