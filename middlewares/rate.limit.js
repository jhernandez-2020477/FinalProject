//Limitar la cantidad de solicitudes en cierto tiempo

import rateLimit from "express-rate-limit"

export const limiter = rateLimit(
    {
        windowMs: 5 * 1000, //Rango de tiempo 15 * 60 * 1000
        max: 2,
        message: {
            message: "You're blocked, wait 15 minutes"
        }
    }
)