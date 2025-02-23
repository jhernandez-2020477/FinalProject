//Configuración del Servidor de express

'use strict'

//ECModules
import express from "express" //Servidor HTTP
import morgan from "morgan" //Logs
import helmet from "helmet" //Seguridad para HTTP
import cors from 'cors' //Acceso al API
import authRoutes from '../src/auth/auth.routes.js'
import categoryRoutes from '../src/category/category.routes.js'
import productRoutes from '../src/product/product.routes.js'
import userRoutes from '../src/user/user.routes.js'
import cartRoutes from '../src/cart/cart.routes.js'
import { limiter } from '../middlewares/rate.limit.js'

const configs = (app )=>{
    app.use(express.json()) //Aceptar y enviar datos JSON
    app.use(express.urlencoded({extended: false})) //No encriptar
    app.use(cors())
    app.use(helmet())
    app.use(limiter)
    app.use(morgan('dev'))
}

const routes = (app)=>{
    //Rutas públicas
    app.use(authRoutes)
    app.use(categoryRoutes)
    app.use(productRoutes)

    //Rutas Privadas
    //Usuario
    app.use('/v1/user', userRoutes)

    //Productos
    app.use('/v1/product', productRoutes)

    //Categoria
    app.use('/v1/category', categoryRoutes)

    //Carrito
    app.use('/v1/cart', cartRoutes)
}

export const initServer = async()=>{
    const app = express()
    try {
        configs(app)
        routes(app)
        app.listen(process.env.PORT)
        console.log(`Server running in port ${process.env.PORT}`)
    } catch (err) {
        console.error('Server init failed', err)
    }
}