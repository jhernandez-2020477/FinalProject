import { Router } from 'express'
import { get, getAll, productRegister, update , deleteProduct, getProductByName, getSellingProducts, getProductsByCategory, getOutOfStockProducts} from './product.controller.js'
import { isAdmin, validateJwt } from '../../middlewares/validate.jwt.js'
import { validRegisProduct, validUpdateProduct } from '../../helpers/validators.js'


const api = Router()

//Agregar Producto
api.post(
    '/',
    [
        validateJwt,
        isAdmin,
        validRegisProduct
    ],
    productRegister
)

//Obtener los productos
api.get(
    '/getProducts',
    getAll
)


//Buscar Producto por Name
api.get(
    '/getProducts/:name',
    getProductByName
)

// Listar productos por más vendidos
api.get(
    '/getSellingTopProducts',  
    getSellingProducts   
)
//Obtener los productos filtrados por la categoria
api.get(
    '/category/:categoryId',
    getProductsByCategory
)

//Obtener productos agostados
api.get(
    '/productsOutOfStock',
    getOutOfStockProducts
)

//Obtener producto por ID
api.get(
    '/:id',
    get
)


//Actualizar producto
api.put(
    '/:id',
    [
        validateJwt,
        isAdmin,
        validUpdateProduct
    ],
    update
)

//Eliminar Producto
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