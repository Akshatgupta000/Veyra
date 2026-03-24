import express from 'express';
import * as product from '../controllers/product.controller.js';

const router = express.Router();
router.get('/', product.getAll);
router.get('/category/:category', product.getByCategory);
router.get('/:id', product.getById);
export default router;
