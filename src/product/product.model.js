//Modelo de Producto
import mongoose, { Schema, model} from "mongoose";

const productSchema = Schema(
    {
        name: {
            type: String,
            maxLength: [50, `Can´t be overcome 50 characters`],
            required: [true, 'Name is required']
        },
        description: {
            type: String,
            maxLength: [70, `Can´t be overcome 70 characters`],
            required: [true, 'Description is required']
        },
        price: {
            type: Number,
            required: [true, 'Price is required']
        },
        stock: {
            type: Number,
            required: [true, 'Stock is required'],
            min: 0
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Category is required'],
        },
        sales: {
            type: Number,
            default: 0
        }
    }
)

//Crear y exportar el modelo
export default model('Product', productSchema)