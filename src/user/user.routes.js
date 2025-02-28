import { Router } from "express";
import { deleteUser, getAll, getPurchaseHistory, updatePassword, updateUser,  updateUserRole } from "./user.controller.js";
import { isAdmin, validateJwt } from "../../middlewares/validate.jwt.js";
import { validUpdatePassword, validUpdateRole, validUpdateUser } from "../../helpers/validators.js";

const api = Router()

//Rutas privadas

//Actualizar Rol
api.put(
    '/:id',
    [
        validateJwt,
        isAdmin,
        validUpdateRole
    ],
    updateUserRole
)

//Actualizar cualquier usuario
api.put(
    '/update/:id',
    [
        validateJwt,
        validUpdateUser
    ],
    updateUser
)


//Borrar cualquier usuario
api.delete(
    '/:id',
    [
        validateJwt
    ],
    deleteUser
)

//Listar Todos los usuarios
api.get(
    '/',
    [
        validateJwt,
        isAdmin
    ],
    getAll
)

//Actualizar contraseña
api.put(
    '/password/:id',
    [
        validateJwt,
        validUpdatePassword
    ],
    updatePassword
)

//Listar un historia de compras
api.get(
    '/getHistorial',
    [
        validateJwt
    ],
    getPurchaseHistory
)


export default api