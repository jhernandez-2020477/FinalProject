import { Router } from 'express'
import { get, getAll, productRegister, update , deleteProduct} from './product.controller.js'
import { isAdmin, validateJwt } from '../../middlewares/validate.jwt.js'
import { validRegisProduct, validUpdateProduct } from '../../helpers/validators.js'


const api = Router()

api.post(
    '/',
    [
        validateJwt,
        isAdmin,
        validRegisProduct
    ],
    productRegister
)

api.get(
    '/getProducts',
    getAll
)

api.get(
    '/:id',
    [
        validateJwt,
        isAdmin
    ],
    get
)

api.put(
    '/:id',
    [
        validateJwt,
        isAdmin,
        validUpdateProduct
    ],
    update
)

api.delete(
    '/:id',
    [
        validateJwt,
        isAdmin
    ],
    deleteProduct
)


//Exportar api
export default api