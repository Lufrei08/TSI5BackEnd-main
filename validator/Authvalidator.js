const {checkSchema} = require('express-validator');
// validador de dados ou validadção
module.exports = {
    singup: checkSchema({
        token:{
            notEmpty:true
        },
        name:{
            notEmpty:true,
            trim: true, //Corta espaços extra
            isLength: {
                options:{min: 2}
            },
            errorMessage: 'Nome precisa de no minimo 2 caracteres'
        },
        email:{
            isEmail: true,
            normalizeEmail:true,
            errorMessage: 'Email invalido.'
        },
        password:{
            isLength:{
                options:{min: 2}
            },
            errorMessage: 'Senha precisa ter no minimo 6 caracteres'
        },
        state:{
           notEmpty:true
        }
    }),
    signin: checkSchema({
       
        email:{
            isEmail: true,
            normalizeEmail:true,
            errorMessage: 'Email invalido.'
        },
        password:{
            isLength:{
                options:{min: 2}
            },
            errorMessage: 'Senha precisa ter no minimo 6 caracteres'
        },
    })
}