//Rutas de Carrito
import { Router } from "express";
import { addProductToCart } from "./cart.controller.js";
import { validateJwt } from "../../middlewares/validate.jwt.js";

const api = Router()
//Rutas privadas
api.post(
    '/addProduct',
    [
        validateJwt
    ],
    addProductToCart
)

//Exporta
export default api