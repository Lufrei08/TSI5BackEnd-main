const { checkSchema } = require('express-validator');
const { options } = require('../routers');

module.exports = {
    editAction: checkSchema({
        id: {
            notEmpty: true
        },
        name: {
            notEmpty: true,
            trim: true,
            isLength: {
                options: { min: 2 }
            },
            errorMessage: 'O nome do produto precisa ter pelo menos dois caracteres!'
        },
        description: {
            notEmpty: true,
            isLength: {
                options: { max:200}
            },
            errorMessage: 'Descrição curta!'
        },
        inventory: {
            notEmpty: true,
            isNumeric: true,
            errorMessage: 'Digite uma quantidade correta'

        },
        dimension: {
            notEmpty: true,
            errorMessage: 'Dimensões não preenchidas'
        }
    })
};