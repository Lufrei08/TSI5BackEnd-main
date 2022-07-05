const express = require('express');
const router = express.Router();
//const vendedorcontroller = require('./controller/vendedorController')
const usercontroller = require('./controller/usercontroller');
const productcontroller = require('./controller/productcontroller');
const AuthController = require('./controller/authcontroller');
const AuthControllerVend = require('./controller/vendedorController')
const validator = require('./validator/uservalidator');
const AuthValidator = require('./validator/Authvalidator');
const Auth = require('./middleware/middleware');
const productvalidator = require("./validator/productvalidator");
const AdController = require('./controller/adcontroller');
const { addProduct } = require('./controller/productcontroller');
const vendValidator = require('./validator/vendvalidator');
const vendvalidator = require('./validator/vendvalidator');

//rota para obter estados --> publica
router.get('/states', usercontroller.getStates);
router.get('/products', productcontroller.getProducts);
//router.get('user/vendedor',);
router.get('/users', usercontroller.getID)
//gerir anuncio (inserir, obter, editar, delete)
router.post('/ad/add', AdController.addAction);
router.get('/ad/list', AdController.getList);
router.get('/ad/item', AdController.getItem);
router.put('/ad/id', AdController.editAction);
router.get('/categories', AdController.getCategories);
//buscas info vendedor
router.get('/user/vendedor', AuthControllerVend.getInfo);
router.put('/user/vendedor',vendValidator.editAction, AuthControllerVend.editVendedor);
// processo criar usuario
//to do --> implementar midleware para rotas privadas...
router.put('/user/me', usercontroller.editAction);
router.put('/products', productvalidator.editAction, productcontroller.editProduct);
//router.get('/user/me', usercontroller.info);
//router.post('/user/me', usercontroller.insertAction);

//processo de login
router.post('/users/signin', validator.editAction, AuthController.signin);
router.post('/user/signup', validator.editAction, AuthController.signup);
router.post('/products', productcontroller.addProduct);
router.post('/user/singin', AuthController.signin);
//router.post('/vendedor/singup', AuthController.signup);
router.post('/vendedor/',AuthControllerVend.addVendedor);


module.exports = router;