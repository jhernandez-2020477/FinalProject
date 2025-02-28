import { body } from "express-validator"; //Capturar todo el body de la solicitud
import { validateErrors , validateErrorWithoutImg} from "./validate.error.js";
import { existUsername, existEmail, objectIdValid } from "./db.validators.js";

export const registerValidation = [
    body('name', 'Name cannot be empty')
        .notEmpty(),
    body('surname', 'Surname cannot be empty')
        .notEmpty(),
    body('username', 'Username cannot be empty')
        .notEmpty()
        .toLowerCase()
        .custom(existUsername),
    body('email', 'Email cannot be empty or is not a valid email')
        .notEmpty()
        .isEmail()
        .custom(existEmail),
    body('password', 'Password cannot be empty')
        .notEmpty()
        .isStrongPassword()
        .withMessage('Password must be strong')
        .isLength({min: 8}),
    body('direction', 'Direction cannot be empty')
        .notEmpty(),
    body('phone', 'Phone cannot be empty')
        .notEmpty()
        .isMobilePhone(),
    validateErrors
]

//Validacines del login
export const loginValidation = [
    body('userLoggin', 'Username or Email cannot be empty')
        .notEmpty()
        .isLowercase(),
    body('password', 'Password cannot be empty')
        .notEmpty()
        .isStrongPassword()
        .isLength()
        .withMessage('The password must be strong')
        .isLength({min: 8}),
    validateErrorWithoutImg
]

//Validación de Producto
export const validRegisProduct = [
    body('name', 'Name cannot be empty, and can´t be overcome 50 characters')
        .notEmpty()
        .isLength({max: 50}),
    body('description', 'Description cannot be empty, and can´t be overcome 70 characters')
        .notEmpty()
        .isLength({max: 70}),
    body('price', 'Price cannot be empty')
        .notEmpty(),
    body('stock', 'Stock cannot be empty')
        .notEmpty(),
    body('category', 'Category cannot be empty')
        .notEmpty()
        .custom(objectIdValid),
    validateErrorWithoutImg
]

export const validUpdateProduct = [
    body('name', 'Name cannot be empty, and can´t be overcome 50 characters')
        .optional()
        .isLength({max: 50}),
    body('description', 'Description cannot be empty, and can´t be overcome 70 characters')
        .optional()
        .isLength({max: 70}),
    body('price', 'Price cannot be empty')
        .optional(),
    body('stock', 'Stock cannot be empty')
        .optional(),
    body('category', 'Category cannot be empty')
        .optional()
        .custom(objectIdValid),
    validateErrorWithoutImg
]

//Validación de Categoria
export const validRegisCategory = [
    body('name', 'Name cannot be empty, and can´t be overcome 50 characters')
        .notEmpty()
        .isLength({max: 50}),
    body('description', 'Description cannot be empty, and can´t be overcome 50 characters')
        .notEmpty()
        .isLength({max: 50}),
    validateErrorWithoutImg
]

export const validUpdatedCategory = [
    body('name', 'Name cannot be empty, and can´t be overcome 50 characters')
        .optional()
        .isLength({max: 50}),
    body('description', 'Description cannot be empty, and can´t be overcome 50 characters')
        .optional()
        .isLength({max: 50}),
    validateErrorWithoutImg
]

//Usuario
export const validUpdateUser = [
    body('name', 'Name cannot be empty')
        .optional(),
    body('surname', 'Surname cannot be empty')
        .optional(),
    body('username', 'Username cannot be empty')
        .optional()
        .toLowerCase()
        .custom(existUsername),
    body('email', 'Email cannot be empty or is not a valid email')
        .optional()
        .isEmail()
        .custom(existEmail),
    body('password', 'Password cannot be empty')
        .optional()
        .isStrongPassword()
        .withMessage('Password must be strong')
        .isLength({min: 8}),
    body('direction', 'Direction cannot be empty')
        .optional(),
    body('phone', 'Phone cannot be empty')
        .optional()
        .isMobilePhone(),
    validateErrors
]
//Actualizar contraseña
export const validUpdatePassword = [
    body('currentPassword', 'Current password cannot be empty')
        .notEmpty() 
        .withMessage('Password cannot be empty'),
    body('newPassword', 'New password cannot be empty')
        .notEmpty()
        .withMessage('Your new password cannot be empty')
        .isStrongPassword()
        .withMessage('Your new password must be strong')
        .isLength({ min: 8 }) 
        .withMessage('New password must be at least 8 characters long'),
        validateErrorWithoutImg
]

export const validUpdateRole = [
    body('role', 'Role must be either "ADMIN" or "CLIENT"')
        .toUpperCase()  
        .notEmpty()
        .isIn(['ADMIN', 'CLIENT'])
        .withMessage('Role must be either "ADMIN" or "CLIENT"'),
        validateErrorWithoutImg
]

export const validUpdateClient = [
    body('name', 'Name cannot be empty')
        .optional(),
    body('surname', 'Surname cannot be empty')
        .optional(),
    body('username', 'Username cannot be empty')
        .optional()
        .toLowerCase()
        .custom(existUsername),
    body('email', 'Email cannot be empty or is not a valid email')
        .optional()
        .isEmail()
        .custom(existEmail),
    body('password', 'Password cannot be empty')
        .optional()
        .isStrongPassword()
        .withMessage('Password must be strong')
        .isLength({min: 8}),
    body('direction', 'Direction cannot be empty')
        .optional(),
    body('phone', 'Phone cannot be empty')
        .optional()
        .isMobilePhone(),
    validateErrors
]

//CARRITO
export const validAddProductToCart = [
    body('product', 'Product cannot be empty')
        .notEmpty(),
    body('amount', 'Amount cannot be empty')
        .notEmpty(),
        validateErrorWithoutImg
]

export const validUpdateProductToCart = [
    body('product', 'Product cannot be empty')
        .notEmpty(),
    body('newAmount', 'Amount cannot be empty')
        .notEmpty(),
        validateErrorWithoutImg
]

//FACTURA
export const validUpdateInvoice = [
    body('product', 'Product cannot be empty')
        .notEmpty(),
    body('newAmount', 'Amount cannot be empty')
        .notEmpty(),
        validateErrorWithoutImg
]