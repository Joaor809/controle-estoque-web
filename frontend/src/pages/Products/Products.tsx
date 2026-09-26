import "./Products.css";
import Menu from "../../components/Menu/Menu";
import { useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import deleteToken from "../../services/deleteToken";

function Produtos() {
    const [openModal, setOpenModal] = useState(false);
    const [modalSearch, setModalSearch] = useState(false);

    const [categorys, setCategorys] = useState([]);
    const [products, setProducts] = useState([]);
    const [resultSearch, setResultSearch] = useState(null);

    const [search, setSearch] = useState("");

    const [name, setName] = useState("");
    const [mark, setMark] = useState("");
    const [price, setPrice] = useState("");
    const [amount, setAmount] = useState(0);
    const [category, setCategory] = useState("");

    const [editing, setEditing] = useState(null);
    const [newPrice, setNewPrice] = useState("");
    const [newQuantity, setNewQuantity] = useState("");

    const token = localStorage.getItem("token");

    async function searchCategory() {
        try {
            const response = await fetch("http://localhost:3000/category", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (deleteToken(response)) return;

            const data = await response.json();
            setCategorys(data);
        } catch (erro) {
            console.error("Erro ao buscar categorias:", erro);
        }
    }

    async function searchProducts() {
        try {
            const response = await fetch("http://localhost:3000/products", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (deleteToken(response)) return;

            const data = await response.json();
            setProducts(data);
        } catch (erro) {
            console.error("Erro ao buscar produtos:", erro);
        }
    }

    async function searchProduct() {
        if (!search.trim()) return;

        try {
            console.log(search);
            const response = await fetch(
                `http://localhost:3000/products/search/${search}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (deleteToken(response)) return;

            if (!response.ok) {
                throw new Error("Erro ao buscar produto");
            }

            const data = await response.json();

            setResultSearch(data);
            setModalSearch(true);
        } catch (erro) {
            console.error("Erro ao buscar produto:", erro);
        }
    }

    async function registerProduct(event) {
        event.preventDefault();

        try {
            const response = await fetch("http://localhost:3000/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name,
                    mark,
                    price,
                    amount,
                    category
                })
            });

            if (deleteToken(response)) return;

            if (!response.ok) {
                throw new Error("Erro ao registrar produto");
            }

            alert("Produto registrado com sucesso!");

            setName("");
            setMark("");
            setPrice("");
            setAmount(0);
            setCategory("");

            setOpenModal(false);

            searchProducts();
        } catch (erro) {
            console.error("Erro ao registrar produto:", erro);
        }
    }

    function initEdition(produto) {
        setEditing(produto.idProduto);
        setNewPrice(produto.preco);
        setNewQuantity(produto.quantidade);
    }

    function cancelEdition() {
        setEditing(null);
        setNewPrice("");
        setNewQuantity("");
    }

    async function saveEdition(idProduct) {
        try {
            const response = await fetch(
                `http://localhost:3000/products/${idProduct}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        price: newPrice,
                        amount: newQuantity
                    })
                }
            );

            if (deleteToken(response)) return;

            if (!response.ok) {
                throw new Error("Erro ao atualizar produto");
            }

            alert("Produto atualizado com sucesso!");

            cancelEdition();

            searchProducts();

            if (search.trim()) {
                searchProduct();
            }
        } catch (erro) {
            console.error("Erro ao editar produto:", erro);
        }
    }

    function closeSearchModal() {
        setModalSearch(false);
        cancelEdition();
    }

    useEffect(() => {
        searchCategory();
        searchProducts();
    }, []);

    return (
        <div className="container-products">
            <Menu />

            <div className="content-products">
                <header>
                    <div className="header-info">
                        <h2>Produtos</h2>
                        <p>Gerencie os produtos do seu estoque.</p>
                    </div>

                    <Button
                        btnName="Novo Produto"
                        onClick={() => setOpenModal(true)}
                    />
                </header>

                {openModal && (
                    <div className="modal-form">
                        <form onSubmit={registerProduct}>
                            <div className="modal-form-info">
                                <h3>Novo produto</h3>

                                <Button
                                    className="btn-close"
                                    btnName="X"
                                    typeButton="button"
                                    onClick={() => setOpenModal(false)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Digite o nome do produto:</label>

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Digite a marca do produto:</label>

                                <input
                                    type="text"
                                    value={mark}
                                    onChange={(e) => setMark(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Digite o preço do produto:</label>

                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Digite a quantidade do produto:</label>

                                <input
                                    type="number"
                                    min="0"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Digite a categoria do produto:</label>

                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>
                                        Selecionar categoria...
                                    </option>

                                    {categorys.map((category) => (
                                        <option
                                            key={category.idCategoria}
                                            value={category.idCategoria}
                                        >
                                            {category.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <Button
                                typeButton="submit"
                                btnName="Registrar"
                            />
                        </form>
                    </div>
                )}

                <main>
                    <div className="card-search">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                searchProduct();
                            }}
                        >
                            <input
                                type="text"
                                placeholder="Buscar produto..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button
                                className="btn-search"
                                typeButton="submit"
                                btnName="Buscar"
                            />
                        </form>
                    </div>

                    {modalSearch && (
                        <div className="modal-search">
                            <div className="modal-search-content">
                                <div className="modal-search-info">
                                    <h3>Resultado da busca</h3>

                                    <Button
                                        className="btn-close-search"
                                        btnName="X"
                                        typeButton="button"
                                        onClick={closeSearchModal}
                                    />
                                </div>

                                {resultSearch?.length > 0 ? (
                                    resultSearch.map((product) => (
                                        <div
                                            className="resultado"
                                            key={product.idProduto}
                                        >
                                            <p>
                                                <strong>ID:</strong>{" "}
                                                {product.idProduto}
                                            </p>

                                            <p>
                                                <strong>Nome:</strong>{" "}
                                                {product.nome}
                                            </p>

                                            <p>
                                                <strong>Marca:</strong>{" "}
                                                {product.marca}
                                            </p>

                                            <p>
                                                <strong>Categoria:</strong>{" "}
                                                {product.categoria}
                                            </p>

                                            {editing === product.idProduto ? (
                                                <>
                                                    <div className="form-group">
                                                        <label>Preço:</label>

                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            value={newPrice}
                                                            onChange={(e) =>
                                                                setNewPrice(
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    <div className="form-group">
                                                        <label>
                                                            Quantidade:
                                                        </label>

                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={newQuantity}
                                                            onChange={(e) =>
                                                                setNewQuantity(
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    <Button
                                                        btnName="Salvar"
                                                        typeButton="button"
                                                        onClick={() =>
                                                            saveEdition(
                                                                product.idProduto
                                                            )
                                                        }
                                                    />

                                                    <Button
                                                        btnName="Cancelar"
                                                        typeButton="button"
                                                        onClick={cancelEdition}
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <p>
                                                        <strong>
                                                            Preço:
                                                        </strong>{" "}
                                                        R${" "}
                                                        {product.preco}
                                                    </p>

                                                    <p>
                                                        <strong>
                                                            Quantidade:
                                                        </strong>{" "}
                                                        {product.quantidade}
                                                    </p>

                                                    <Button
                                                        btnName="Editar"
                                                        typeButton="button"
                                                        onClick={() =>
                                                            initEdition(product)
                                                        }
                                                    />
                                                </>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p>Produto não encontrado.</p>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="table-products">
                        <table>
                            <thead>
                                <tr>
                                    <th>NOME</th>
                                    <th>MARCA</th>
                                    <th>CATEGORIA</th>
                                    <th>PREÇO</th>
                                </tr>
                            </thead>

                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.idProduto}>
                                        <td>{product.name}</td>
                                        <td>{product.mark}</td>
                                        <td>{product.category}</td>
                                        <td>R$ {product.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Produtos;