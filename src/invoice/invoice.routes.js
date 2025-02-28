//Rutas de autenticación
import { Router } from "express";
import { getInvoicesByUser, updateProductInInvoice } from "./invice.controller.js";
import { validateJwt } from "../../middlewares/validate.jwt.js";
import { validUpdateInvoice } from "../../helpers/validators.js";

const api = Router()
//Rutas privadas
api.put(
    '/:id',
    [
        validateJwt,
        validUpdateInvoice
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