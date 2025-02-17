//Middlewares de validación de tokens
'use strict'

import { findUser } from '../helpers/db.validators.js'
import jwt from 'jsonwebtoken'

//Validar que venga un token válido y no haya expirado
export const validateJwt = async(req, res, next)=>{
    try{
        //Obtener la llave de acceso al token
        let secretKey = process.env.SECRET_KEY
        //Obtener el token de los headers
        let { authorization } = req.headers
        //verificar si viene el token
        if(!authorization) return res.status(401).send({message: 'Unauthorized'})
        //Desencriptar el token
        let user = jwt.verify(authorization, secretKey)
        //Verificar que aún exista el usuario en la DB
        const validateUser = await findUser(user.uid)
        if(!validateUser) return res.status(404).send(
            {
                succes: false,
                message: 'User not found - Unauthorized'
            }
        )
        //Inyectar la información del usuario a la solicitud
        req.user = user
        //Todo salió bien, pase a la siguiente función
        next()
    }catch(err){
        console.error(err)
        return res.status(401).send({message: 'Invalid token or expired'})
    }
}

//Validación por Roles (Depues de la validacion del token)
export const isAdmin = async(req, res, next)=>{
    try {
        const { user } = req
        if(!user || user.role !== 'ADMIN') return res.status(403).send(
            {
                succes: false,
                message: `You dont have acces | username ${user.username}`
            }
        )
        next()
    } catch (err) {
        console.error(err)
        return res.statuts(403).send(
            {
                succes: false,
                message: 'Unauthorized role'
            }
        )
    }
}

