const mongoose = require('mongoose');
const Product = require("../model/product"); //Referencias de acesso ao banco de dados
const { validationResult, matchedData } = require('express-validator');
const ProductValidator = require("../validator/productvalidator");

module.exports = {
    getProducts: async (req, res) => {
        let id = await Product.find();
        res.json({ id });
    },

    addProduct: async (req, res) => {
        let { name, description, inventory, dimension } = req.body;

        if (!name || !description || !inventory) {
            res.json({ error: 'Algum item obrigatório não foi preenchido' });
            return;
        }
        console.log(name);

        const newProduct = new Product();
        newProduct.name = name;
        newProduct.description = description;
        newProduct.inventory = inventory;
        newProduct.dimension = dimension;
        // console.log(newProduct.name)
        const info = await newProduct.save();
        res.json({ info });

    },
    editProduct: async (req, res) => {
        //para fazer validação 
        const erros = validationResult(req);

        if (!erros.isEmpty()) {
            res.json({
                error: erros.mapped()
            });
            return;
        }

        //const data = req.body;
        const data = matchedData(req);
       // console.log(data);
        let updates = {};
        if (data.name) {
            updates.name = data.name;
        }

        if (data.description) {
            updates.description = data.description;
        }

        if (data.inventory) {
            updates.inventory = data.inventory;
        }

        if (data.dimension) {
            updates.dimension = data.dimension;
        }
        //console.log(_id)
        await Product.findByIdAndUpdate({ _id: data.id }, { $set: updates });
        res.json({});
    }


}

