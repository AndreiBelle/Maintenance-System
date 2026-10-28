const { firebaseAdminAuth } = require('../firebaseAdmin');

async function authenticateToken(req, res, next) {
    const authorization = req.headers.authorization;

    if(!authorization || !authorization.startsWith("Bearer")){
        return res.status(401).json({
            message: "Autenticação necessária."
        });
    }

    const idToken = authorization.slice("Bearer ".length);

    try{
        const decodeToken = await firebaseAdminAuth.verifyIdToken(idToken);

        req.user = {
            uid: decodeToken.uid,
            email: decodeToken.email
        };

        next();
    } catch (err) {
        console.error("Falha na validação do token: ", err.code);

        return res.status(401).json({message: "Sessão inválida ou expirada."})
    }
}

module.exports = {
    authenticateToken
}
