import { Router } from "express"
import { categoryRegister, deleteCategory, getAll, update } from "./category.controller.js"
import { isAdmin, validateJwt } from "../../middlewares/validate.jwt.js"
import { validRegisCategory, validUpdatedCategory } from "../../helpers/validators.js"

const api = Router()

//Rutas Privadas
api.post(
    '/',
    [
        validateJwt,
        isAdmin,
        validRegisCategory
    ],
    categoryRegister
)

api.get(
    '/getCategories',
    getAll
)

api.put(
    '/:id',
    [
        validateJwt,
        isAdmin,
        validUpdatedCategory
    ],
    update
)

api.delete(
    '/:id',
    [
        validateJwt,
        isAdmin
    ],
    deleteCategory
)
export default api