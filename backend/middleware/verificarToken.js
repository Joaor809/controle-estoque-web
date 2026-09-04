import jwt from "jsonwebtoken";

function verificarToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            erro: "Token não informado"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const usuario = jwt.verify(
            token,
            "segredo-do-sistema"
        );

        req.usuario = usuario;

        next();
    } catch (erro) {
        return res.status(401).json({
            erro: "Token inválido ou expirado"
        });
    }
}

export default verificarToken;