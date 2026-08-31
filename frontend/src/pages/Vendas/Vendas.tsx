import Button from "../../components/Button/Button";
import CartCard from "../../components/CartCard/CartCard";
import Menu from "../../components/Menu/Menu";
import "./Vendas.css";
import { useEffect, useState } from "react";

function Vendas() {
    const [produtos, setProdutos] = useState([]);
    const [idProduto, setIdProduto] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [cart, setCart] = useState([]);

    async function buscarProdutos() {
        try {
            const response = await fetch("http://localhost:3000/produtos");
            setProdutos(await response.json());
        } catch (erro) {
            console.error("Erro ao buscar produtos:", erro);
        }
    }

    function adicionarCarrinho() {
        const produto = produtos.find(
            produto => produto.idProduto === Number(idProduto)
        );

        if (!produto){
            alert("Produto não encontrado!");
        } else{
            alert(produto.nome)
        }
    }

    useEffect(() => {
        buscarProdutos();
    }, [])

    return (
        <div className="container">
            <Menu />
            <div className="table-products">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NOME</th>
                            <th>MARCA</th>
                            <th>CATEGORIA</th>
                            <th>PREÇO</th>
                            <th>QUANTIDADE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produtos.map((produto) => (
                            <tr key={produto.idProduto}>
                                <td>{produto.idProduto}</td>
                                <td>{produto.nome}</td>
                                <td>{produto.marca}</td>
                                <td>{produto.categoria}</td>
                                <td>R$ {produto.preco}</td>
                                <td>{produto.quantidade}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="shopping-cart">
                <div className="products-cart">
                    <CartCard nameProduct="Arroz" priceProduct="149,90" amountProduct="14" />
                </div>
                <div className="add-product">
                    <div className="inputs-add">
                        <input type="text" placeholder="ID" value={idProduto} onChange={(e) => setIdProduto(e.target.value)} />
                        <input type="text" placeholder="Qtd" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
                    </div>
                    <Button btnName="Adicionar ao carrinho" onClick={adicionarCarrinho}/>
                </div>
            </div>
        </div>
    );
}
export default Vendas;