//Elinar archivos si algo sale mal
import { unlink } from 'fs/promises' //Acciones de eliminacion, adicion etc
import { join } from 'path'

export const deleteFileOnError = async(error, req, res, next)=>{
    if(req.file && req.filePath){
        const filePath = join(req.filePath, req.file.filename)
        try {
            await unlink(filePath)
        } catch (unlinkErr) {
            console.error('Error deleting file: ', unlinkErr)
        }
    }if(error.status === 400 || error.errors){//=== (Igualación estricta  (tipo dato)) 1 === '1' false
        return res.status(400).send({message: 'Error registering user', error})
    }
    return res.status(500).send({message: error.message})      
}