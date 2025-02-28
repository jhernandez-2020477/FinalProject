//Conexion a la DB
import mongoose from "mongoose";
import { initCategory } from '../src/category/category.controller.js'
import { initAdminUser } from "../src/auth/auth.controller.js";


export const connect = async()=>{
    try {
        //Ciclo de vida de mongoose
        mongoose.connection.on('error',()=>{
            console.log("MongoDB | Could not be connect to mongodb")
        })
        mongoose.connection.on('connecting',()=>{
            console.log("MongoDB | try conecting")
        })
        mongoose.connection.on('connected',()=>{
            console.log("MongoDB | conected to mongodb")
        })
        mongoose.connection.once('open',()=>{
            console.log("MongoDB | connected to database")
        })
        mongoose.connection.once('open', () => {
            //console.log("MongoDB | User created");
            initAdminUser()
        })
        mongoose.connection.once('open', () => {
            //console.log("MongoDB | Category created");
            initCategory()
        })
        mongoose.connection.on('reconnected',()=>{
            console.log("MongoDB | reconnected to mongodb")
        })
        mongoose.connection.on('disconnected',()=>{
            console.log("MongoDB | disconnedted")
        })

        //Conectarse a la DB
        await mongoose.connect(
            `${process.env.DB_SERVICE}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
            {
                maxPoolSize: 50, //Máximo de conexiones
                serverSelectionTimeoutMS: 500 //Tiempo máximo para intentar conectarse
            }
        )
    } catch (err) {
        console.error('Database connection failed', err)
    }
}