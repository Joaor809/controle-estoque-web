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
        const [response] = await conn.query("SELECT * FROM categorys");
        res.json(response);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao buscar categorias" });
    }
});

app.get("/products", verifyToken, async (req, res) => {
    try {
        const sql = `
                SELECT p.idProduct, p.name, p.mark, c.name AS category, p.price
                FROM products p
                JOIN categorys c ON p.idCategory = c.idCategory
                ORDER BY p.idProduct
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
                SELECT p.idProduct, p.name, p.mark, c.name AS category, p.price
                FROM products p
                JOIN categorys c ON p.idCategory = c.idCategory
                WHERE p.name LIKE ?
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
                INSERT INTO products (name, mark, price, idCategory)
                VALUES (?, ?, ?, ?, ?)
            `;

        const [result] = await conn.query(sql, [name, mark, price, category]);

        res.status(201).json({
            mensagem: "Produto cadastrado com sucesso",
            idProduto: result.insertId
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao cadastrar produto" });
    }
});

app.post("/sales", verifyToken, async (req, res) => {
    const { products, totalPrice } = req.body;
    try {
        const [sale] = await conn.query("INSERT INTO sales(totalValue) VALUES (?)", [totalPrice]);
        const idSale = sale.insertId;

        for (const product of products) {
            await conn.query("INSERT INTO item_venda (idVenda, idProduto, quantidade, preco) VALUES (?, ?, ?, ?)", [idSale, product.idProduct, product.quantity, product.price]);

            await conn.query("UPDATE produtos SET quantidade = quantidade - ? WHERE idProduto = ?", [product.quantity, product.idProduct]);
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
        const [sales] = await conn.query("SELECT idSale, date, totalValue FROM sales ORDER BY date DESC");
        res.json(sales);
    } catch (error) {
        res.json([])
    }
});
app.get("/quantitySales", verifyToken, async (req, res) => {
    const [salesQuantity] = await conn.query("SELECT COUNT(*) AS quantity FROM sales");
    res.json(salesQuantity[0].quantidade)
})

app.post("/login", async (req, res) => {
    try {
        const { cpfNumbers, password } = req.body;

        const sql = "SELECT * FROM users WHERE cpf = ?";

        const [users] = await conn.query(sql, [cpfNumbers]);
        if (users.length === 0) {
            return res.status(401).json({ erro: "CPF ou senha inválidos" });
        }
        const user = users[0];
        const passwordCorrect = await bcrypt.compare(password, user.password);

        if (!passwordCorrect) {
            return res.status(401).json({ erro: "Email ou senha inválidos" });
        }
        const token = jwt.sign(
            { id: user.idUser },
            process.env["jwt-secret"],
            { expiresIn: "1h" }
        );
        res.json({
            mensagem: "Login realizado",
            token,
            user: {
                id: user.idUser,
                nome: user.name,
                cpf: user.cpf,
                email: user.email,
                telefone: user.telephone

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
            SELECT item_sale.idItem, item_sale.idSale, products.name, item_sale.quantity, item_sale.price
            FROM item_sale
            INNER JOIN products ON products.idProduct = item_sale.idProduct
            WHERE idSale = ?
        `;

    const [products] = await conn.query(sql, [idSale]);
    res.send(products);
})

app.post("/register", async (req, res) => {
    try {
        const { name, email, cpfNumbers, telephoneNumbers, password } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);

        const sqlQuery = "SELECT * FROM users WHERE cpf = ? OR telephone = ? OR email = ?";
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
        const sqlRegister = "INSERT INTO users(name, cpf, email, telephone, password) VALUES (?, ?, ?, ?, ?)";

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
