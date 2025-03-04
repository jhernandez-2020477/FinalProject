//Rutas de autenticación
import { Router } from "express";
import { deleteInvoice, getInvoicesByUser, updateProductInInvoice } from "./invice.controller.js";
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

api.delete(
    '/:id',
    [
        validateJwt
    ],
    deleteInvoice
)

// Exportar
export default api