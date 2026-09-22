import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import conn from "./db.js";
import jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";
import verifyToken from "./middleware/verifyToken.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/category", verifyToken, async (req, res) => {
    try {
        const [response] = await conn.query("SELECT * FROM categorias");
        res.json(response);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao buscar categorias" });
    }
});

app.get("/products", verifyToken, async (req, res) => {
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

app.get("/products/search/:nameProduct", verifyToken, async (req, res) => {
    try {
        const { nameProduct } = req.params;
        const sql = `
                SELECT p.idProduto, p.nome, p.marca, c.nome AS categoria, p.preco, p.quantidade
                FROM produtos p
                JOIN categorias c ON p.idCategoria = c.idCategoria
                WHERE p.nome LIKE ?
            `;
        const [result] = await conn.query(sql, [`%${nameProduct}%`]);
        res.json(result);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao buscar produto" });
    }
});

app.post("/products", verifyToken, async (req, res) => {
    try {
        const { name, mark, price, amount, category } = req.body;

        const sql = `
                INSERT INTO produtos (nome, marca, preco, quantidade, idCategoria)
                VALUES (?, ?, ?, ?, ?)
            `;

        const [result] = await conn.query(sql, [name, mark, price, amount, category]);

        res.status(201).json({
            mensagem: "Produto cadastrado com sucesso",
            idProduto: result.insertId
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao cadastrar produto" });
    }
});

app.put("/products/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { price, amount } = req.body;

        const sql = `
                UPDATE produtos
                SET preco = ?, quantidade = ?
                WHERE idProduto = ?
            `;

        const [result] = await conn.query(sql, [price, amount, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ erro: "Produto não encontrado" });
        }

        res.json({ mensagem: "Produto atualizado com sucesso" });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao atualizar produto" });
    }
});

app.get("/quantityProducts", verifyToken, async (req, res) => {
    const [result] = await conn.query("SELECT COUNT(*) AS quantidade FROM produtos");
    res.json(result[0].quantidade);
});

app.get("/lowQuantityProducts", verifyToken, async (req, res) => {
    const [result] = await conn.query("SELECT COUNT(*) AS quantidade FROM produtos WHERE quantidade <= 40");
    res.json(result[0].quantidade);
});

app.post("/sales", verifyToken, async (req, res) => {
    const { products, totalPrice } = req.body;
    try {
        const [sale] = await conn.query("INSERT INTO vendas(valorTotal) VALUES (?)", [totalPrice]);
        const idSale = sale.insertId;

        for (const product of products) {
            await conn.query("INSERT INTO item_venda (idVenda, idProduto, quantidade, preco) VALUES (?, ?, ?, ?)", [idSale, product.idProduto, product.quantidade, product.preco]);

            await conn.query("UPDATE produtos SET quantidade = quantidade - ? WHERE idProduto = ?", [product.quantidade, product.idProduto]);
        }
        res.status(201).json({
            mensagem: "Venda realizada com sucesso!",
            idSale
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            erro: "Erro ao realizar venda"
        });
    }
});

app.get("/sales", verifyToken, async (req, res) => {
    try {
        const [sales] = await conn.query("SELECT idVenda, data, valorTotal FROM vendas ORDER BY data DESC");
        res.json(sales);
    } catch (error) {
        res.json([])
    }
});
app.get("/quantitySales", verifyToken, async (req, res) => {
    const [salesQuantity] = await conn.query("SELECT COUNT(*) AS quantidade FROM vendas");
    res.json(salesQuantity[0].quantidade)
})

app.post("/login", async (req, res) => {
    try {
        const { cpfNumbers, password } = req.body;

        const sql = "SELECT * FROM usuarios WHERE cpf = ?";

        const [users] = await conn.query(sql, [cpfNumbers]);
        if (users.length === 0) {
            return res.status(401).json({ erro: "CPF ou senha inválidos" });
        }
        const user = users[0];
        const passwordCorrect = await bcrypt.compare(password, user.senha);

        if (!passwordCorrect) {
            return res.status(401).json({ erro: "Email ou senha inválidos" });
        }
        const token = jwt.sign(
            { id: user.idUsuario },
            process.env["jwt-secret"],
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
        if (erro.name === "TokenExpiredError") {
            return res.status(401).json({ error: "TokenExpiredError", message: "JWT Expired" })
        }
        console.error(erro);
        res.status(500).json({ erro: "Erro no servidor" });
    }
});

app.get("/productsSold/:idSale", verifyToken, async (req, res) => {
    const { idSale } = req.params;

    const sql = `
            SELECT item_venda.idItem, item_venda.idVenda, produtos.nome, item_venda.quantidade, item_venda.preco
            FROM item_venda
            INNER JOIN produtos ON produtos.idProduto = item_venda.idProduto
            WHERE idVenda = ?
        `;

    const [products] = await conn.query(sql, [idSale]);
    res.send(products);
})

app.post("/register", async (req, res) => {
    try {
        const { name, email, cpfNumbers, telephoneNumbers, password } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);

        const sqlQuery = "SELECT * FROM usuarios WHERE cpf = ? OR telefone = ? OR email = ?";
        const [resultQuery] = await conn.query(sqlQuery, [cpfNumbers, telephoneNumbers, email]);

        console.log("Telefone recebido:", telephoneNumbers);
        console.log("Resultado do banco:", resultQuery);
        if (resultQuery.length > 0) {
            const user = resultQuery[0];
            if (user.cpf === cpfNumbers) {
                return res.status(409).json({ error: "CPF já cadastrado" });
            }
            if (user.telefone === telephoneNumbers) {
                return res.status(409).json({ error: "Telefone já cadastrado" });
            }
            if (user.email === email) {
                return res.status(409).json({ error: "E-mail já cadastrado" });
            }
        }
        const sqlRegister = "INSERT INTO usuarios(nome, cpf, email, telefone, senha) VALUES (?, ?, ?, ?, ?)";

        const response = await conn.query(sqlRegister, [name, cpfNumbers, email, telephoneNumbers, passwordHash]);

        res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso!",
        });
    } catch (error) {
        res.status(500).json({ error: "Erro no servidor" });
    }
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
