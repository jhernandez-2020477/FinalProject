//Modelo de Carrito
import mongoose, { Schema, model } from "mongoose"

const cartSchema = Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            //required: [true, 'Usuario is required']
        },
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: [true, 'Product is required']
                },
                amount: {
                    type: Number,
                    required: [true, 'Amount is required'],
                    min: 1
                }
            }
        ],
        totalPrice: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            default: 'INCOMPLETE'
        }
    }
)
//Exportar y crear el modelo
export default model('Cart', cartSchema)