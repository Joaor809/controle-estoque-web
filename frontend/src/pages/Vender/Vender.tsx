import Button from "../../components/Button/Button";
import CartCard from "../../components/CartCard/CartCard";
import Menu from "../../components/Menu/Menu";
import "./Vender.css";
import { useEffect, useState } from "react";

function Vendas() {
    const [produtos, setProdutos] = useState([]);
    const [idProduto, setIdProduto] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);

    const token = localStorage.getItem("token");

    async function buscarProdutos() {
        try {
            const response = await fetch("http://localhost:3000/produtos", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProdutos(await response.json());
        } catch (erro) {
            console.error("Erro ao buscar produtos:", erro);
        }
    }

    function adicionarCarrinho() {
        const produto = produtos.find(
            produto => produto.idProduto === Number(idProduto)
        );

        if (!produto) {
            alert("Produto não encontrado!");
            return;
        }
        if (Number(quantidade) <= 0) {
            alert("Quantidade inválida");
            return;
        }
        if (Number(quantidade) > produto.quantidade) {
            alert("Quantidade maior que o estoque!");
            return;
        }
        const item = {
            idProduto: produto.idProduto,
            nome: produto.nome,
            preco: produto.preco * Number(quantidade),
            quantidade: Number(quantidade)
        }
        setCart([...cart, item]);
        setIdProduto("");
        setQuantidade("");
    }

    async function finalizarVenda() {
        try {
            if (cart.length === 0) {
                alert("Nenhum produto adicionado ao carrinho!")
            } else {
                const response = await fetch("http://localhost:3000/vendas", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        produtos: cart,
                        valorTotal: total
                    })
                });
                const data = await response.json();
                if (!response.ok) {
                    alert("A compra não foi realizada!");
                    return;
                }
                alert("Venda realizada com sucesso!");
                setCart([]);
                setTotal(0);
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function relatorioVendas(){

    }

    useEffect(() => {
        buscarProdutos();
    }, [])
    useEffect(() => {
        const novoTotal = cart.reduce(
            (total, produto) => total + Number(produto.preco),
            0
        );

        setTotal(novoTotal);
    }, [cart]);

    return (
        <div className="container-vender">
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
                    {cart.map((item) => (
                        <CartCard key={item.idProduto} nameProduct={item.nome} priceProduct={item.preco.toFixed(2)} amountProduct={item.quantidade} />
                    ))}
                </div>
                <div className="add-product">
                    <div className="inputs-add">
                        <input type="text" placeholder="ID" value={idProduto} onChange={(e) => setIdProduto(e.target.value)} />
                        <input type="text" placeholder="Qtd" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
                    </div>
                    <Button btnName="Adicionar ao carrinho" onClick={adicionarCarrinho} />
                </div>
                <div className="complete-purchase">
                    <div className="total-price">
                        <h3>Total: R${total.toFixed(2)}</h3>
                    </div>
                    <div className="finish">
                        <Button btnName="Finalizar compra" onClick={finalizarVenda} />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Vendas;