//referenciar model User --> criar modulo, se existe token(query, body)
//verificar se token vazio, token é valido ou invalido

//const User = require('../model/user');
const User = require('../model/vendedor');
module.exports = {
    private: async (req, res, next) => {
        if (!req.query.token && !req.body.token) {
            res.json({ logado: !false });

            return;
        }

        if (req.query.token) {
            token = req.query.token;
        }

        if (req.body.token) {
            token = req.body.token;
        }

        if (!token) {
            res.json({ logado: false });
            return;
        }

        const user = await User.findOne({
            token
        });

        if (!user) {
            res.json({ logado: false});
            
            return;
        }

        next();
    }
}