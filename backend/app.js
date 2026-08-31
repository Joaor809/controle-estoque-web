import express from "express";
import cors from "cors";
import conn from "./db.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/categorias", async (req, res) => {
    try {
        const [response] = await conn.query("SELECT * FROM categorias");
        res.json(response);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao buscar categorias" });
    }
});

app.get("/produtos", async (req, res) => {
    try {
        const sql = `
            SELECT p.idProduto, p.nome, p.marca, c.nome AS categoria, p.preco, p.quantidade
            FROM produtos p
            JOIN categorias c ON p.idCategoria = c.idCategoria
            ORDER BY p.idProduto
        `;
        const [response] = await conn.query(sql);
        res.json(response);
    } catch (erro) {
        console.error(erro);
        res.send([])
    }
});

app.get("/produtos/buscar", async (req, res) => {
    try {
        const { nome } = req.query;
        const sql = `
            SELECT p.idProduto, p.nome, p.marca, c.nome AS categoria, p.preco, p.quantidade
            FROM produtos p
            JOIN categorias c ON p.idCategoria = c.idCategoria
            WHERE p.nome LIKE ?
        `;
        const [resultado] = await conn.query(sql, [`%${nome}%`]);
        res.json(resultado);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao buscar produto" });
    }
});

app.post("/produtos", async (req, res) => {
    try {
        const { nome, marca, preco, quantidade, categoria } = req.body;

        const sql = `
            INSERT INTO produtos (nome, marca, preco, quantidade, idCategoria)
            VALUES (?, ?, ?, ?, ?)
        `;

        const [resultado] = await conn.query(sql, [nome, marca, preco, quantidade, categoria]);

        res.status(201).json({
            mensagem: "Produto cadastrado com sucesso",
            idProduto: resultado.insertId
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao cadastrar produto" });
    }
});

app.put("/produtos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { preco, quantidade } = req.body;

        const sql = `
            UPDATE produtos
            SET preco = ?, quantidade = ?
            WHERE idProduto = ?
        `;

        const [resultado] = await conn.query(sql, [preco, quantidade, id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Produto não encontrado" });
        }

        res.json({ mensagem: "Produto atualizado com sucesso" });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao atualizar produto" });
    }
});

app.get("/qtdProdutos", async (req, res) => {
    const [resultado] = await conn.query("SELECT COUNT(*) AS quantidade FROM produtos");
    res.json(resultado[0].quantidade);
});

app.get("/qtdProdutosBaixa", async (req, res) => {
    const [resultado] = await conn.query("SELECT COUNT(*) AS quantidade FROM produtos WHERE quantidade <= 40");
    res.json(resultado[0].quantidade);
})

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});