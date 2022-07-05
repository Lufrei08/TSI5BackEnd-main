const mongoose = require('mongoose');
const { validationResult, matchedData } = require('express-validator');
const bcrypt = require('bcrypt');
const State = require("../model/state");
const User = require("../model/vendedor");
const vendedor = require('../model/vendedor');



module.exports = {
    getStates: async (req, res) => {
        let states = await State.find();
        res.json({ states });
    },
    getInfo: async (req, res) => {
        // let {nome, estado }= await User.find();
        let id = await User.find();
        res.json({ id });


    },

    addVendedor: async (req, res) => {
        let { name, email, passwordHash, state, token } = req.body;

        if (!name || !email || !passwordHash || !token) {
            res.json({ error: 'Algum item obrigatório não foi preenchido' });
            return;
        }

        //console.log(name)
        const newVendedor = new vendedor();
        if (name) {
            newVendedor.name = name;
        }
        if (email) {
            const emailCheck = await User.findOne({ email: email });
            if (emailCheck) {
                res.json({ error: 'Email já existente!' });
                return;
            }
            newVendedor.email = email;
        }

        if (passwordHash) {
            passwordHash = await bcrypt.hash(passwordHash, 10);
            newVendedor.passwordHash = passwordHash;
        }

        if (state) {
            if (mongoose.Types.ObjectId.isValid(state)) {
                const statesCheck = await State.findById(state);
                if (!statesCheck) {
                    res.json({ error: 'Estado não existe' });
                    return;
                }
                newVendedor.state = state;

            } else {
                res.json({ error: 'Código do estado em formato inválido' });
                return;
            }
        }

        if (token) {
            const padraoToken = (Date.now + Math.random()).toString();
            token = await bcrypt.hash(padraoToken, 10);
            newVendedor.token = token;
        }

        const info = await newVendedor.save();
        res.json({ info });

    },
    editVendedor: async (req, res) => {
        /*const erros = validationResult(req);
        if (!erros.isEmpty()) {
            res.json({
                error: erros.mapped()
            });
            return;
        }*/

        // const data = matchedData(req);
        const data = req.body;

        let updates = {};
        console.log(data.name);
        if (data.name) {
            updates.name = data.name;
        }

        if (data.email) {
            const emailCheck = await User.findOne({ email: data.email });
            if (emailCheck) {
                res.json({ error: 'Email ja existente' });
                return;
            }
            updates.email = data.email;

        }

        if (data.state) {
            if (mongoose.Types.ObjectId.isValid(data.state)) {
                const stateCheck = await State.findById(data.state);

                if (!stateCheck) {
                    res.json({ error: 'Estado nao existe' });
                    return;
                }

                updates.state = data.state;

            } else {
                res.json({ error: 'Codigo do estado em formato invalido' });
                return;
            }
        }

        if (data.passwordHash) {
            updates.passwordHash = await bcrypt.hash(data.password, 10);

        }
        console.log(updates)
        await User.findByIdAndUpdate({ _id: data.id }, { $set: updates });

        res.json({});

    },
    deleteVendedor: async (req, res) => {
        let id = req.body;
        console.log(req.body);
        let data = await User.deleteOne(id);
        res.send(data)
    }

};