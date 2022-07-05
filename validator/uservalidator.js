const { checkSchema } = require('express-validator');
const { options } = require('../routers');

module.exports = {
    editAction: checkSchema({
        token: {
            notEmpty: true
        },
        name: {
            notEmpty: true,
            trim: true,
            isLength: {
                options: { min: 2 }
            },
            errorMessage: 'Seu nome precisa ter pelo menos dois caracteres!'
        },
        email: {
            isEmail: true,
            normalizeEmail: true,
            errorMessage: 'Email invalido!'
        },
        password: {
            isLength: {
                options: { min: 8 }
            },
            errorMessage: 'Senha precisa ter pelo menos 8 caracteres',
            isLength: {
                options: { max: 20 }
            },
            errorMessage: 'Senha precisa ter no máximo 20 caracteres'

        },
        state: {
            notEmpty: true,
            errorMessage: 'Estado não preenchido'
        }
    })
};