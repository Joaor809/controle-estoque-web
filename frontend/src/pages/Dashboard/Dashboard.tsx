import { useEffect, useState } from "react";
import CardDashboard from "../../components/CardDashboard/CardDashboard";
import Menu from "../../components/Menu/Menu";
import "./Dashboard.css"
function Dashboard() {
    const [qtdProdutos, setQtdProdutos] = useState(0);
    const [qtdProdutosBaixo, setQtdProdutosBaixo] = useState(0)

    async function buscarQtdProdutos() {
        const response = await fetch("http://localhost:3000/qtdProdutos");
        const data = await response.json();
        setQtdProdutos(data);
    }
    async function buscarQtdProdutosBaixo(){
        const response = await fetch("http://localhost:3000/qtdProdutosBaixa");
        const data = await response.json()
        setQtdProdutosBaixo(data)
    }

    useEffect(() => {
        buscarQtdProdutos();
        buscarQtdProdutosBaixo();
    }, []);
    return (
        <div className="container">
            <Menu />
            <div className="content">
                <header>
                    <div className="header-info">
                        <h2>Dashboard</h2>
                        <p>Controle de estoque e vendas.</p>
                    </div>
                </header>
                <main>
                    <div className="cards-container">
                        <CardDashboard icon="bi bi-box-seam" cardName="Produtos" countInfo={qtdProdutos} />
                        <CardDashboard icon="bi bi-exclamation-triangle" cardName="Estoque baixo" countInfo="42" countInfo={qtdProdutosBaixo}/>
                        <CardDashboard icon="bi bi-cart" cardName="Vendas" countInfo="42" />
                    </div>
                </main>
            </div>
        </div>
    );
}
export default Dashboard;