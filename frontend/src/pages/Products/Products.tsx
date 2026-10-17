import "./Products.css";
import Menu from "../../components/Menu/Menu";
import React, { useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import deleteToken from "../../services/deleteToken";
import generateCod from "../../services/generateCod";

function Produtos() {
    const [openModal, setOpenModal] = useState(false);
    const [modalSearch, setModalSearch] = useState(false);

    const [categorys, setCategorys] = useState([]);
    const [products, setProducts] = useState([]);
    const [resultSearch, setResultSearch] = useState(null);
    
    const [search, setSearch] = useState("");
    
    const [codProduct, setCodProduct] = useState("");
    const [name, setName] = useState("");
    const [mark, setMark] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");

    const [editing, setEditing] = useState(null);
    const [newPrice, setNewPrice] = useState("");
    const [newQuantity, setNewQuantity] = useState("");

    const token = localStorage.getItem("token");

    async function searchCategory() {
        try {
            const response = await fetch("https://api.joaor809.online/categorys", {
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
            const response = await fetch("https://api.joaor809.online/products", {
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
                `https://api.joaor809.online/products/search/${encodeURIComponent(search.trim())}`,
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

    async function registerProduct(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            const codProduct: string = generateCodProduct(10000, 90000);
            const response = await fetch("https://api.joaor809.online/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    codProduct,
                    name,
                    mark,
                    price,
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
            setCategory("");

            setOpenModal(false);

            searchProducts();
        } catch (erro) {
            console.error("Erro ao registrar produto:", erro);
        }
    }

    function closeSearchModal() {
        setModalSearch(false);
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
                            <div className="btn-close">
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
                                            key={category.idCategory}
                                            value={category.idCategory}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <Button
                                className="btnRegister"
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
                                        <div className="resultado" key={product.codProduct}>
                                            <p>
                                                <strong>Código do Produto:</strong>{" "}
                                                {product.codProduct}
                                            </p>
                                            <p>
                                                <strong>Nome:</strong>{" "}
                                                {product.name}
                                            </p>
                                            <p>
                                                <strong>Marca:</strong>{" "}
                                                {product.mark}
                                            </p>
                                            <p>
                                                <strong>Categoria:</strong>{" "}
                                                {product.category}
                                            </p>
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
                                    <th>CÓDIGO DO PRODUTO</th>
                                    <th>NOME</th>
                                    <th>MARCA</th>
                                    <th>CATEGORIA</th>
                                    <th>PREÇO</th>
                                </tr>
                            </thead>

                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.codProduct}>
                                        <td><strong>{product.codProduct}</strong></td>
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