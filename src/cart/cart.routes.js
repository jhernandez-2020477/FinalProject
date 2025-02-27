//Rutas de Carrito
import { Router } from "express";
import { addProductToCart, completePurchase, deleteProductInCart, updateProductInCart } from "./cart.controller.js";
import { validateJwt } from "../../middlewares/validate.jwt.js";
import { validAddProductToCart, validUpdateProductToCart } from "../../helpers/validators.js";

const api = Router()
//Rutas privadas
api.post(
    '/addProduct',
    [
        validateJwt,
        validAddProductToCart
    ],
    addProductToCart
)

api.put(
    '/:id',
    [
        validateJwt,
        validUpdateProductToCart
    ],
    updateProductInCart
)

api.delete(
    '/:id',
    [
        validateJwt
    ],
    deleteProductInCart
)

api.post(
    '/completePurchase',
    [
        validateJwt
    ],
    completePurchase
)

//Exporta
export default api