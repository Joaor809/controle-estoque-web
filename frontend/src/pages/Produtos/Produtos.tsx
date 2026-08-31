import "./Produtos.css";
import Menu from "../../components/Menu/Menu";
import { useEffect, useState } from "react";
import Button from "../../components/Button/Button";

function Produtos() {
    const [modalAberto, setModalAberto] = useState(false);
    const [modalBusca, setModalBusca] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [resultadoBusca, setResultadoBusca] = useState(null);
    const [busca, setBusca] = useState("");
    const [nome, setNome] = useState("");
    const [marca, setMarca] = useState("");
    const [preco, setPreco] = useState("");
    const [quantidade, setQuantidade] = useState(0);
    const [categoria, setCategoria] = useState("");
    const [editando, setEditando] = useState(null);
    const [novoPreco, setNovoPreco] = useState("");
    const [novaQuantidade, setNovaQuantidade] = useState("");

    async function buscarCategorias() {
        try {
            const response = await fetch("http://localhost:3000/categorias");
            setCategorias(await response.json());
        } catch (erro) {
            console.error("Erro ao buscar categorias:", erro);
        }
    }

    async function buscarProdutos() {
        try {
            const response = await fetch("http://localhost:3000/produtos");
            setProdutos(await response.json());
        } catch (erro) {
            console.error("Erro ao buscar produtos:", erro);
        }
    }

    async function buscarProduto() {
        if (!busca.trim()) return;
        try {
            const response = await fetch(`http://localhost:3000/produtos/buscar?nome=${encodeURIComponent(busca)}`);
            setResultadoBusca(await response.json());
            setModalBusca(true);
        } catch (erro) {
            console.error("Erro ao buscar produto:", erro);
        }
    }

    async function registrarProduto(e) {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/produtos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome, marca, preco, quantidade, categoria })
            });

            if (!response.ok) throw new Error("Erro ao registrar produto");

            alert("Produto registrado com sucesso!");
            setNome("");
            setMarca("");
            setPreco("");
            setQuantidade(0);
            setCategoria("");
            setModalAberto(false);
            buscarProdutos();
        } catch (erro) {
            console.error("Erro ao registrar produto:", erro);
        }
    }

    function iniciarEdicao(produto) {
        setEditando(produto.idProduto);
        setNovoPreco(produto.preco);
        setNovaQuantidade(produto.quantidade);
    }

    function cancelarEdicao() {
        setEditando(null);
        setNovoPreco("");
        setNovaQuantidade("");
    }

    async function salvarEdicao(idProduto) {
        try {
            const response = await fetch(`http://localhost:3000/produtos/${idProduto}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ preco: novoPreco, quantidade: novaQuantidade })
            });

            if (!response.ok) throw new Error("Erro ao atualizar produto");

            alert("Produto atualizado com sucesso!");
            cancelarEdicao();
            buscarProdutos();
            buscarProduto();
        } catch (erro) {
            console.error("Erro ao editar produto:", erro);
        }
    }

    useEffect(() => {
        buscarCategorias();
        buscarProdutos();
    }, []);

    return (
        <div className="container">
            <Menu />
            <div className="content">
                <header>
                    <div className="header-info">
                        <h2>Produtos</h2>
                        <p>Gerencie os produtos do seu estoque.</p>
                    </div>
                    <Button btnName="Novo Produto" onClick={() => setModalAberto(true)} />
                </header>

                {modalAberto && (
                    <div className="modal-form">
                        <form onSubmit={registrarProduto}>
                            <Button className="btn-close" btnName="X" typeButton="button" onClick={() => setModalAberto(false)} />
                            <h3>Novo produto</h3>

                            <div className="form-group">
                                <label>Digite o nome do produto:</label>
                                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
                            </div>

                            <div className="form-group">
                                <label>Digite a marca do produto:</label>
                                <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} required />
                            </div>

                            <div className="form-group">
                                <label>Digite o preço do produto:</label>
                                <input type="number" step="0.01" value={preco} onChange={(e) => setPreco(e.target.value)} required />
                            </div>

                            <div className="form-group">
                                <label>Digite a quantidade do produto:</label>
                                <input type="number" min="0" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} required />
                            </div>

                            <div className="form-group">
                                <label>Digite a categoria do produto:</label>
                                <select value={categoria} onChange={(e) => setCategoria(e.target.value)} required>
                                    <option value="" disabled>Selecionar categoria...</option>
                                    {categorias.map((categoria) => (
                                        <option key={categoria.idCategoria} value={categoria.idCategoria}>{categoria.nome}</option>
                                    ))}
                                </select>
                            </div>

                            <Button typeButton="submit" btnName="Registrar" />
                        </form>
                    </div>
                )}

                <main>
                    <div className="card-search">
                        <input
                            type="text"
                            placeholder="Buscar produto..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && buscarProduto()}
                        />
                        <Button className="btn-search" typeButton="button" btnName="Buscar" onClick={buscarProduto} />
                    </div>

                    {modalBusca && (
                        <div className="modal-search">
                            <div className="modal-search-content">
                                <Button
                                    className="btn-close-search"
                                    btnName="X"
                                    typeButton="button"
                                    onClick={() => {
                                        setModalBusca(false);
                                        cancelarEdicao();
                                    }}
                                />

                                <h3>Resultado da busca</h3>

                                {resultadoBusca?.length > 0 ? (
                                    resultadoBusca.map((produto) => (
                                        <div className="resultado" key={produto.idProduto}>
                                            <p><strong>ID:</strong> {produto.idProduto}</p>
                                            <p><strong>Nome:</strong> {produto.nome}</p>
                                            <p><strong>Marca:</strong> {produto.marca}</p>
                                            <p><strong>Categoria:</strong> {produto.categoria}</p>

                                            {editando === produto.idProduto ? (
                                                <>
                                                    <div className="form-group">
                                                        <label>Preço:</label>
                                                        <input type="number" step="0.01" value={novoPreco} onChange={(e) => setNovoPreco(e.target.value)} />
                                                    </div>

                                                    <div className="form-group">
                                                        <label>Quantidade:</label>
                                                        <input type="number" min="0" value={novaQuantidade} onChange={(e) => setNovaQuantidade(e.target.value)} />
                                                    </div>

                                                    <Button btnName="Salvar" typeButton="button" onClick={() => salvarEdicao(produto.idProduto)} />
                                                        <p></p>
                                                    <Button btnName="Cancelar" typeButton="button" onClick={cancelarEdicao} />
                                                </>
                                            ) : (
                                                <>
                                                    <p><strong>Preço:</strong> R$ {produto.preco}</p>
                                                    <p><strong>Quantidade:</strong> {produto.quantidade}</p>
                                                    <Button btnName="Editar" typeButton="button" onClick={() => iniciarEdicao(produto)} />
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
                                    <th>ID PRODUTO</th>
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
                </main>
            </div>
        </div>
    );
}

export default Produtos;