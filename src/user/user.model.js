//Modelo de usuario
import mongoose, { Schema, model} from "mongoose";

const userSchema = Schema(
    {
        name: {
            type: String,
            maxLength: [25, `Can´t be overcome 25 characters`],
            required: [true, 'Name is required']
        },
        surname: {
            type: String,
            maxLength: [25, `Can´t be overcome 25 characters`],
            required: [true, 'Surname is required']
        },
        username: {
            type: String,
            required: [true, 'User is required'],
            unique: true, 
            maxLength: [15, `Can´t be overcome 25 characters`]
        },
        email: {
            type: String,
            unique: true,
            required: [true, 'Email is required']
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minLength: [8, 'Password must be 8 characters'],
            maxLength: [100, `Can't be overcome 25 characters`]
        },
        direction: {
            type: String,
            required: [true, 'Direction is required'],
            minLength: [8, 'Direction must be 8 characters'],
            maxLength: [100, `Can't be overcome 100 characters`]
        },
        phone: {
            type: String,
            required: [true, 'Phone is required'],
            maxLength: [13, `Can´t be overcome 8 numbers`],
            minLength: [8, 'Phone must be 8 numbers']
        },
        profilePicture : {
            type: String 
        },
        role: {
            type: String,
            required: [true, 'Role is required'],
            uppercase: true, //Volver en mayúscula
            enum: ['ADMIN', 'CLIENT'],
        },
        status: {
            type: Boolean,
            default: true
        }
    }
)

//Modificar el JSON para excluir datos en la respuesta
userSchema.methods.toJSON = function(){
    const {__v, password, ...user} = this.toObject()
    return user
}

//Crear y exportar el modelo
export default model('User', userSchema)