const { v4: uuid } = require('uuid');
const jimp = require('jimp');

//referencia models
const Category = require('../model/category');
const State = require('../model/state');
const User = require('../model/user');
const Ad = require('../model/ad');

// Função para ajustar a imagem... obter imagem --> buffer de bytes
//definir nome, cortar imagem, comprimir a imagem, salvar as alterações

const addImage = async (buffer) => {
    let newName = `${uuid()}.jpg`;
    let tmpImage = await jimp.read(buffer); //leu a imagem
    tmpImage.cover(500, 500).quality(75).write(`./assets/${newName}`);
    return newName;
}
module.exports = {
    addAction: async (req, res) => {
        // preparar para receber dados do anuncio
        // validar e organizar dados 
        // Opcionalmente enviar imagens...
        let { title, price, priceneg, token, cat, desc } = req.body;
        const user = await User.findOne({ token: token }).exec();

        if (!title || !cat || !desc) {
            res.json({ error: 'Titulo ou categoria ou descrição não preenchido' });
            return;
        }
        if (price) {
            // Tratar R$8.000,02 ---> 8000.02
            price = price.replace('.', '').replace(',', '.').replace('R$', '');
            price = parseFloat(price);
        } else {
            price = 0;
        }
        
        const newAd = new Ad();
        newAd.idUser = user._id;
        newAd.state = user.state;
        newAd.category = cat;
        newAd.dateCreated = Date.now();
        newAd.title = title;
        newAd.price = price;
        newAd.description = desc;
        newAd.status = true;

        // enviar imagem --> verificar se tem alguma e se é imagem
        // verificar quantas imagens --> definir imagem de capa
        console.log(req.files.img);
        if (req.files && req.files.img) {
            // verificar se tem varias imagens (for)
            if (req.files.img.length != 0) {
                //definir formatos da imagem e guardar em disco
                if (['image/jpeg', 'image/jpg', 'image/png'].includes(req.files.img.mimetype)) {
                    let url = await addImage(req.files.img.data);
                    newAd.images.push({
                        url,
                        default: false
                    })
                }
            } else {
                for (let i = 0; i < req.files.img.length; i++) {
                    if (['image/jpeg', 'image/jpg', 'image/png'].includes(req.files.img.mimetype)) {
                        let url = await addImage(req.files.img.data);
                        newAd.images.push({
                            url,
                            default: false
                        })
                    }
                }
            }
        }

        const info = await newAd.save();
        res.json({
            id: info._id
        });
    },

    getList: async (req, res) => {

    },

    getItem: async (req, res) => {

    },

    editAction: async (req, res) => {

    },

    getCategories: async (req, res) => {
        // apresentar todos os dados
        const cats = await Category.find();
        let categories = [];
        //montar categorias
        for (let i in cats) {
            categories.push({
                ...cats[i].name
            });
        }
        res.json({ categories });
    }
}