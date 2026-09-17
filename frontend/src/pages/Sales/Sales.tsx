import "./Sales.css";
import Menu from "../../components/Menu/Menu";
import Button from "../../components/Button/Button";
import { useEffect, useState } from "react";
import deleteToken from "../../services/deleteToken";

function sales() {
    const [sale, setSale] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [productsSold, setProductsSold] = useState([]);

    const token = localStorage.getItem("token");

    async function salesReport() {
        const response = await fetch("http://localhost:3000/sales", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (deleteToken(response)) return;
        const data = await response.json();
        setSale(data)
    }
    async function listProductsSold(idSale) {
        const response = await fetch(`http://localhost:3000/productsSold/${idSale}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if (deleteToken(response)) return;
        const data = await response.json();
        setProductsSold(data);
    }
    useEffect(() => {
        salesReport();
    }, [])
    return (
        <div className="container-sales">
            <Menu />
            <div className="content-sales">
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
                                        <td><Button btnName="Ver produtos vendidos" onClick={() => {
                                            setOpenModal(true);
                                            listProductsSold(item.idVenda);
                                        }} /></td>
                                    </tr>
                                );
                            })}
                            {openModal && (
                                <div className="modal-products">
                                    <div className="modal-products-content">
                                        <div className="modal-products-info">
                                            <h3>Produtos Vendidos:</h3>
                                            <Button
                                                className="btn-close-modal"
                                                btnName="X"
                                                typeButton="button"
                                                onClick={() => {
                                                    setOpenModal(false);
                                                    setProductsSold([]);
                                                }}
                                            />
                                        </div>
                                        {productsSold.length > 0 ? (
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>ID VENDA</th>
                                                        <th>NOME</th>
                                                        <th>QUANTIDADE</th>
                                                        <th>PREÇO</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {productsSold.map((item) => {
                                                        return (
                                                            <tr key={item.idVenda}>
                                                                <td>{item.idVenda}</td>
                                                                <td>{item.nome}</td>
                                                                <td>{item.quantidade}</td>
                                                                <td>{item.preco}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <div>
                                                <h4>Nenhum produto encontrado!</h4>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
export default sales;
