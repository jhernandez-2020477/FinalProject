//Modelo de Factura
import mongoose, { Schema, model } from "mongoose"

const invoiceSchema = Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Usuario is required']
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
                    required: [true, 'Amount is required']
                },
                price: {
                    type: Number,
                    required: [true, 'Price is required']
                }
            }
        ],
        total: {
            type: Number,
            default: 0
            //required: [true, 'Total is required']
        },
        date: {
            type: Date,
            default: Date.now
        }
    }
)
//Crear y exportar el modelo
export default model('Invoice', invoiceSchema)