//Rutas de autentificación
import { Router } from "express";
import { register, test, login } from "./auth.controller.js";
import { validateJwt } from '../../middlewares/validate.jwt.js'
import { loginValidation, registerValidation } from '../../helpers/validators.js'
import { uploadProfilePicture } from '../../middlewares/multer.uploads.js'
import { deleteFileOnError } from '../../middlewares/delete.file.on.error.js'


const api = Router()
//Rutas públicas
api.get('/test', test)

api.post(
    '/register', 
    [
        uploadProfilePicture.single('profilePicture'), 
        registerValidation, 
        deleteFileOnError
    ],
        register
)

api.post(
    '/login', 
    [
        loginValidation
    ], 
    login
)



//Exportar
export default api