//Validar errores
import { validationResult } from "express-validator"

//Para cuando hat imagenes
export const validateErrors = (req, res, next)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return next(errors)
    }
    next()
}

//Para cuando no hay imagenes
export const validateErrorWithoutImg = (req, res, next)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).send(
            {
                success: false,
                message: 'Validation Errors',
                errors: errors.errors
            }
        )
    }
    next()
}