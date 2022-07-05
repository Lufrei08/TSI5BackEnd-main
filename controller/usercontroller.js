const mongoose = require('mongoose');
const { validationResult, matchedData } = require('express-validator');
const bcrypt = require('bcrypt');
const State = require("../model/state");
const User = require("../model/user"); //Referencias de acesso ao banco de dados
const UserValidator = require("../validator/uservalidator");
const { update } = require('../model/state');

module.exports = {
    getStates: async (req, res) => {
        let states = await State.find();
        res.json({ states });
    },
    editAction: async (req, res) => {
        //para fazer validação 
        const erros = validationResult(req);

        if (!erros.isEmpty()) {
            res.json({
                error: erros.mapped()
            });
            return;
        }

        const data = matchedData(req);

        let updates = {};
        if (data.name) {
            updates.name = data.name;
        }

        if (data.email) {
            const emailCheck = await User.findOne({ email: data.email });
            if (emailCheck) {
                res.json({ error: 'Email já existente' });
                return;
            }
            updates.email = data.email;
        }

        if (data.states) {
            if (mongoose.Types.ObjectId.isValid(data.states)) {
                const statesCheck = await State.findById(data.states);
                if (!statesCheck) {
                    res.json({ error: 'Estado não existe' });
                    return;
                }
                updates.states = data.states;
                } else {
                    res.json({ error: 'Código do estado em formato inválido' });
                    return;
                }
        }
        if (data.password) {
            updates.passwordHash = await bcrypt.hash(data.password, 10);
        }

        await User.findByIdAndUpdate({ token: data.token }, { $set: updates });
        res.json({});
    },

    getID: async(req, res) => {
        let id = await User.find();
        res.json({id});
    }
}