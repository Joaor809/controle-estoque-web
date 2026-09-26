import jwt from "jsonwebtoken";

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    const [tipo, token] = authHeader?.split(" ") ?? [];

    if (tipo !== "Bearer" || !token) {
        return res.status(401).json({
            erro: "Token não fornecido"
        });
    }

    try {
        const segredoJwt = process.env["jwt-secret"];

        if (!segredoJwt) {
            throw new Error("Segredo JWT não configurado");
        }

        const user = jwt.verify(token, segredoJwt);

        req.user = user;

        next();
    } catch (erro) {
        console.error(erro);

        return res.status(401).json({
            erro: "Token inválido ou expirado"
        });
    }
}

export default verifyToken;
