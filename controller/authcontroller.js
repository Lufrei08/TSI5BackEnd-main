const mongoose = require('mongoose');
const { validationResult, matchedData } = require('express-validator');
const bcrypt = require('bcrypt');
const State = require("../model/state");
const User = require("../model/user"); //Referencias de acesso ao banco de dados

module.exports = {
    signin: async (req, res) => {
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            res.json({
                error: erros.mapped()
            });
            return;
        }
        const data = matchedData(req);

        //validar no banco email correspondente
        const user = await User.findOne({ email: data.email });

        if (!user) {
            res.json({ error: 'Email ou senha não corresponde' });
            return;
        }

        // validar senha correspondente
        const match = await bcrypt.compare(data.password, user.passwordHash);

        if (!match) {
            res.json({ error: 'Email ou senha não corresponde' });
            return;
        }
        const padraoToken = (Date.now + Math.random()).toString();
        const token = await bcrypt.hash(padraoToken, 10);
        user.token = token;
        await user.save();

        res.json({ token, email: data.email });
    },
    signup: async (req, res) => {
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            res.json({
                error: erros.mapped()
            });
            return;
        }
        const data = matchedData(req);
        const user = await User.findOne({ email: data.email });

        if (user) {
            res.json({ error: 'O email já é existente' });
            return;
        }

        if (mongoose.Types.ObjectId.isValid(data.state)) {
            const stateCheck = await State.findById(data.state);
            if (!stateCheck) {
                res.json({ error: 'Estado não existe' });
                return;
            }
           // updates.states = data.states;
        } else {
            res.json({ error: 'Código do estado em formato inválido' });
            return;
        }
        const passwordHash = await bcrypt.hash(data.password, 10);
        const padraoToken = (Date.now + Math.random()).toString();
        const token = await bcrypt.hash(padraoToken, 10);

        const newUser = new User({
            name: data.name,
            email: data.email,
            passwordHash,
            token,
            state: data.states
        });

        await newUser.save();
        res.json({ token });
    }
}