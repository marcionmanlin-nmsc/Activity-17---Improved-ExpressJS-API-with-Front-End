const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const productController = require('../controllers/productController');
const { uploadProduct } = require('../middleware/upload');

router.get('/', auth, productController.getAll);
router.get('/:id', auth, productController.getOne);
router.post('/', auth, uploadProduct.single('image'), productController.create);
router.put('/:id', auth, uploadProduct.single('image'), productController.update);
router.delete('/:id', auth, productController.remove);

module.exports = router;
