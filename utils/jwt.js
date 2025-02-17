//Generador de Tokens
'use strict'

import jwt from 'jsonwebtoken'
                                //Objeto con datos usuarios
export const generateJwt = async(payload)=>{
    try {
        return jwt.sign(
            payload,
            process.env.SECRET_KEY,
            {
                expiresIn: '3h', //Recomendable 1h o 2h
                algorithm: 'HS256' //Los bits que va a tener este token
            }
        )
    } catch (err) {
        console.error(err)
        return err
    }
}