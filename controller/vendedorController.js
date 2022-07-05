const mongoose = require ('mongoose');
const {validationResult, matchedData} = require ('express-validator');
const bcrypt = require('bcrypt');
const State = require("../model/state");
const User = require("../model/vendedor");
const vendedor = require('../model/vendedor');



module.exports = {
    getStates: async(req, res) => {
        let states = await State.find();
        res.json({ states });
    },
    getInfo: async(req, res) => {
       // let {nome, estado }= await User.find();
       let id = await User.find(); 
       res.json({ id });
        
        
    },

    addVendedor: async(req, res) => {
        let {name, email, password, state} = req.body;
        const erros = validationResult(req.body);
        console.log(email)
        if(!erros.isEmpty()){
            res.json({
                error: erros.mapped()
            });
            return;
        }
        //const data = matchedData(req.body);
        //console.log(name)
        const newVendedor = new vendedor();
        newVendedor.name = name;
        console.log(name);
        if(email){
            const emailCheck = await User.findOne({ email: email});
            if(emailCheck){
                res.json ({error: 'Email já existente!'});
                return;
            }
            newVendedor.email = email;   
        }
        
        newVendedor.password = password;
        newVendedor.state = state;

        const info = await newVendedor.save();
        res.json({info});

    },
    editAction: async(req, res)=> {
        //TODO --> Validação
        const erros = validationResult (req);

        if(!erros.isEmpty()){
            req.json({
                error: erros.mapped()
            });
            return;
        }
        const data = matchedData(req);

        let updates = {};

        if(data.name){
            updates.name = data.name;
        }

        if(data.email){
            const emailCheck = await User.findOne({email: data.email});
            if(emailCheck){
                res.json({error: 'Email já existente'});
                return;
            }

            updates.email = data.email;
        }

        if(data.state){
            if(mongoose.Types.ObjectId.isValid(data.state)){
                const stateCheck = await State.findById(data.state);
                if(!stateCheck){
                    res.json({error: 'Estado não existe'});
                    return;
                }
                updates.states = data.state;
            }else{
                res.json({error: 'codigo do estado em formato invalido'});
                return;
            }
        }
        if (data.password) {
            updates.passwordHash = await bcrypt.hash(data.password, 10);
        }
        await User.findByIdAndUpdate({token:data.token}, {$set: updates});
        res.json({});
    }
};