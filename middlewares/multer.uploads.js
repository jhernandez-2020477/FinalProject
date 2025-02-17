//Gestionar las imagenes en general (Función reutilizable
import multer from "multer"
import { dirname, extname, join } from "path"
import { fileURLToPath } from "url"

const CURRENT_DIR =  dirname(fileURLToPath(import.meta.url))//Ubicación actual del proyecto
const MIMETYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
const MAX_SIZE = 10000000//Bytes (10)

const multerConfig = (destinationPath)=>{
    return multer(
        {
            storage: multer.diskStorage(//En donde se va a almacenar
                {
                    destination: (req, file, cb)=>{//Donde guardar
                        const fullPath = join(CURRENT_DIR, destinationPath)
                        req.filePath = fullPath
                        cb(null, fullPath)
                    },
                    filename: (req, file, cb)=>{//Con que nombre
                        const fileExtension = extname(file.originalname) //Extraer la extensión de archivos
                        const fileName = file.originalname.split(fileExtension)[0]
                        cb(null, `${fileName}-${Date.now()}${fileExtension }`)
                    }
                }
            ),
            fileFilter: (req, file, cb)=>{ //Validar el tipo de archivo aceptado
                if(MIMETYPES.includes(file.mimetype)) cb(null, true)
                else cb(new Error(`Only ${MIMETYPES.join(' ')} are allowed`))
            },
            limits: { //Para tamaños de archivos
                fileSize: MAX_SIZE
            }
        }
    )    
}

export const uploadProfilePicture = multerConfig('../uploads/img/users') 