import CardDashboard from "../../components/CardDashboard/CardDashboard";
import Menu from "../../components/Menu/Menu";
import "./Dashboard.css"
function Dashboard(){
    return(
        <div className="container">
            <Menu/>
            <main>
                <div className="cards-container">
                    <CardDashboard icon="bi bi-box-seam" cardName="Produtos" countInfo="42"/>
                    <CardDashboard icon="bi bi-exclamation-triangle" cardName="Estoque baixo" countInfo="42"/>
                    <CardDashboard icon="bi bi-cart" cardName="Vendas" countInfo="42"/>
                </div>
            </main>
        </div>
    );
}
export default Dashboard;