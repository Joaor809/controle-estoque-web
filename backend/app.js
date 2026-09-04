import express from "express";
import cors from "cors";
import conn from "./db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import verificarToken from "./middleware/verificarToken.js"

const app = express();

app.use(cors());
app.use(express.json());

app.get("/categorias", verificarToken, async (req, res) => {
    try {
        const [response] = await conn.query("SELECT * FROM categorias");
        res.json(response);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao buscar categorias" });
    }
});

app.get("/produtos", verificarToken, async (req, res) => {
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

app.get("/produtos/buscar", verificarToken, async (req, res) => {
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

app.post("/produtos", verificarToken, async (req, res) => {
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

app.put("/produtos/:id", verificarToken, async (req, res) => {
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

app.get("/qtdProdutos", verificarToken, async (req, res) => {
    const [resultado] = await conn.query("SELECT COUNT(*) AS quantidade FROM produtos");
    res.json(resultado[0].quantidade);
});

app.get("/qtdProdutosBaixa", verificarToken, async (req, res) => {
    const [resultado] = await conn.query("SELECT COUNT(*) AS quantidade FROM produtos WHERE quantidade <= 40");
    res.json(resultado[0].quantidade);
});

app.post("/vendas", verificarToken, async (req, res) => {
    console.log("BODY RECEBIDO:", req.body);
    const { produtos, valorTotal } = req.body;
    try {
        const [venda] = await conn.query("INSERT INTO vendas(valorTotal) VALUES (?)", [valorTotal]);
        const idVenda = venda.insertId;

        for (const produto of produtos) {
            await conn.query("INSERT INTO item_venda (idVenda, idProduto, quantidade, preco) VALUES (?, ?, ?, ?)", [idVenda, produto.idProduto, produto.quantidade, produto.preco]);

            await conn.query("UPDATE produtos SET quantidade = quantidade - ? WHERE idProduto = ?", [produto.quantidade, produto.idProduto]);
        }
        res.status(201).json({
            mensagem: "Venda realizada com sucesso!",
            idVenda
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            erro: "Erro ao realizar venda"
        });
    }
});

app.get("/vendas", verificarToken, async (req, res) => {
    try {
        const [vendas] = await conn.query("SELECT idVenda, data, valorTotal FROM vendas ORDER BY data DESC");
        res.json(vendas);
    } catch (error) {
        res.json([])
    }
});
app.get("/qtdVendas", verificarToken, async (req, res) => {
    const [qtdVendas] = await conn.query("SELECT COUNT(*) AS quantidade FROM vendas");
    res.json(qtdVendas[0].quantidade)
})

app.post("/login", async (req, res) => {
    try {
        const { cpfNumeros, senha } = req.body;
        const [users] = await conn.query("SELECT * FROM usuarios WHERE cpf = ?", [cpfNumeros]);
        if (users.length === 0) {
            return res.status(401).json({ erro: "CPF ou senha inválidos" });
        }
        const user = users[0];
        const senhaCorreta = await bcrypt.compare(senha, user.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ erro: "Email ou senha inválidos" });
        }
        const token = jwt.sign(
            { id: user.idUsuario },
            "segredo-do-sistema",
            { expiresIn: "1h" }
        );
        res.json({
            mensagem: "Login realizado",
            token,
            usuario: {
                id: user.idUsuario,
                nome: user.nome,
                cpf: user.cpf,
                email: user.email,
                telefone: user.telefone

            }
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro no servidor" });
    }
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});