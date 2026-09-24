import Button from "../../components/Button/Button";
import CartCard from "../../components/CartCard/CartCard";
import Menu from "../../components/Menu/Menu";
import "./Sell.css";
import { useEffect, useState } from "react";
import deleteToken from "../../services/deleteToken";

function Vendas() {
    const [products, setProducts] = useState([]);
    const [idProduct, setIdProduct] = useState("");
    const [amount, setAmount] = useState("");
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);

    const token = localStorage.getItem("token");

    async function searchProducts() {
        try {
            const response = await fetch("http://localhost:3000/products", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (deleteToken(response)) return;
            setProducts(await response.json());
        } catch (erro) {
            console.error("Erro ao buscar produtos:", erro);
        }
    }

    function addToCart() {
        const product = products.find(
            product => product.idProduto === Number(idProduct)
        );

        if (!product) {
            alert("Produto não encontrado!");
            return;
        }
        if (Number(amount) <= 0) {
            alert("Quantidade inválida");
            return;
        }
        if (Number(amount) > product.quantidade) {
            alert("Quantidade maior que o estoque!");
            return;
        }
        const item = {
            idProduto: product.idProduto,
            nome: product.nome,
            preco: product.preco * Number(amount),
            quantidade: Number(amount)
        }
        setCart([...cart, item]);
        setIdProduct("");
        setAmount("");
        }

    async function completeSale() {
        try {
            if (cart.length === 0) {
                alert("Nenhum produto adicionado ao carrinho!")
            } else {
                const response = await fetch("http://localhost:3000/sales", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        products: cart,
                        totalPrice: total
                    })
                });
                if (deleteToken(response)) return;
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

    useEffect(() => {
        searchProducts();
    }, [])
    useEffect(() => {
        const newTotal = cart.reduce(
            (total, product) => total + Number(product.preco),
            0
        );

        setTotal(newTotal);
    }, [cart]);

    return (
        <div className="container-sell">
            <Menu />
            <div className="table-products">
                <table>
                    <thead>
                        <tr>
                            <th>ID PRODUTO</th>
                            <th>NOME</th>
                            <th>MARCA</th>
                            <th>CATEGORIA</th>
                            <th>PREÇO</th>
                            <th>QUANTIDADE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.idProduto}>
                                <td>{product.idProduto}</td>
                                <td>{product.nome}</td>
                                <td>{product.marca}</td>
                                <td>{product.categoria}</td>
                                <td>R$ {product.preco}</td>
                                <td>{product.quantidade}</td>
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
                        <input type="text" placeholder="ID" value={idProduct} onChange={(e) => setIdProduct(e.target.value)} />
                        <input type="text" placeholder="Qtd" value={amount} onChange={(e) => setAmount(e.target.value)} />
                    </div>
                    <Button btnName="Adicionar ao carrinho" onClick={addToCart} />
                </div>
                <div className="complete-purchase">
                    <div className="total-price">
                        <h3>Total: R${total.toFixed(2)}</h3>
                    </div>
                    <div className="finish">
                        <Button btnName="Finalizar compra" onClick={completeSale} />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Vendas;
