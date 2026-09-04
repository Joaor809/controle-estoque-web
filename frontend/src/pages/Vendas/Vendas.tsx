import "./Vendas.css";
import Menu from "../../components/Menu/Menu";
import Button from "../../components/Button/Button";
import { useEffect, useState } from "react";

function Vendas() {
    const [sale, setSale] = useState([]);

    const token = localStorage.getItem("token");

    async function relatorioVendas() {
        const response = await fetch("http://localhost:3000/vendas", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await response.json();

        setSale(data)
    }
    async function produtosVendidos(){

    }
    useEffect(() => {
        relatorioVendas();
    }, [])
    return (
        <div className="container-vendas">
            <Menu />
            <div className="content-vendas">
                <div className="table-sale">
                    <table>
                        <thead>
                            <tr>
                                <th>ID VENDA</th>
                                <th>DATA</th>
                                <th>VALOR</th>
                                <th>AÇÕES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sale.map((item) => {
                                return (
                                    <tr key={item.idVenda}>
                                        <td>{item.idVenda}</td>
                                        <td>{new Date(item.data).toLocaleDateString("pt-BR")}</td>
                                        <td>R$ {Number(item.valorTotal).toFixed(2)}</td>
                                        <td><Button btnName="Ver produtos vendidos" onClick={produtosVendidos}/></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
export default Vendas;