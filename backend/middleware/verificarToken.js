import jwt from "jsonwebtoken";

function verificarToken(req, res, next) {
    const authHeader = req.headers.authorization;

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            erro: "Token não fornecido"
        });
    }

    try {
        const usuario = jwt.verify(token, "segredo-do-sistema");

        req.usuario = usuario;

        next();
    } catch (erro) {
        console.error(erro);

        return res.status(401).json({
            erro: "Token inválido ou expirado"
        });
    }
}

export default verificarToken;