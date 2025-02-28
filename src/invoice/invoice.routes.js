//Rutas de autenticación
import { Router } from "express";
import { getInvoicesByUser, updateProductInInvoice } from "./invice.controller.js";
import { validateJwt } from "../../middlewares/validate.jwt.js";

const api = Router()
//Rutas privadas
api.put(
    '/:id',
    [
        validateJwt
    ],
    updateProductInInvoice
)

api.get(
    '/:userId',
    [
        validateJwt
    ],
    getInvoicesByUser
)

// Exportar
export default api