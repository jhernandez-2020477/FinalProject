//Lógica del User
import { checkPassword, encrypt} from '../../utils/encrypt.js'
import User from '../user/user.model.js'
import Invoice from  '../invoice/invoice.model.js'

//Editar Rol solo ADMIN puede hacerlo
export const updateUserRole = async(req, res)=>{
    const { id } = req.params
    const { name, surname, username, email, password, direction, phone, ...data } = req.body
    try {
        const updateRole = await User.findByIdAndUpdate(
            id,
            data,
            {new: true}
        )
        if(!updateRole) return res.status(404).send(
            {
                success: false,
                message: 'User not found, role not updated'
            }
        )
        return res.send(
            {
                success: true,
                message: 'Role updated successfully :)',
                updateRole
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error when adding Role',
                err
            }
        )
    }
}
//Editar usuario GENEREAL, ADMIN ACTUALIZA CUALQUIERA MENOS OTRO ADMIN
export const updateUser = async (req, res) => {
    const { id } = req.params
    const { role, password, ...data } = req.body 

    try {
        const adminUser = req.user 
        const userToUpdate = await User.findById(id)

        if (!userToUpdate) {
            return res.status(404).send(
                {
                    success: false,
                    message: 'User not found, not updated'
                }
            )
        }

        // Un ADMIN no puede modificar a otro ADMIN.
        if (adminUser.role === 'ADMIN' && userToUpdate.role === 'ADMIN' && adminUser.uid !== id) {
            return res.status(403).send(
                {
                    success: false,
                    message: 'You cannot modify another ADMIN.'
                }
            )
        }

        // Un usuario normal solo puede editarse a sí mismo
        if (adminUser.role !== 'ADMIN' && adminUser.uid !== id) {
            return res.status(403).send(
                {
                    success: false,
                    message: 'You can only edit your own profile.'
                }
            )
        }

        // **Actualizar usuario sin modificar la contraseña ni el rol**
        const updatedUser = await User.findByIdAndUpdate(
            id, 
            data, 
            { new: true }
        )

        return res.send(
            {
                success: true,
                message: 'User updated successfully :)',
                updatedUser
            }
        )

    } catch (err) {
        console.error(err);
        return res.status(500).send(
            {
                success: false,
                message: 'General error when updating User',
                err
            }
        )
    }
}


//Eliminar usuario, ADMIN PUEDE OTROS MENOS OTROS Y CLIENTE SOLO EL MISMO
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const { password } = req.body

        const adminUser = req.user
        const userToDelete = await User.findById(id)

        if (!userToDelete) {
            return res.status(404).send(
                {
                    success: false,
                    message: 'User not found'
                }
            )
        }

        // Algunas restricciones
        // Un CLIENTE solo puede eliminarse a sí mismo (validando contraseña).
        if (adminUser.role !== 'ADMIN' && adminUser.uid !== id) {
            return res.status(403).send(
                {
                    success: false,
                    message: 'You can only delete your own account.'
                }
            )
        }

        // Un ADMIN no puede eliminar a otro ADMIN.
        if (adminUser.role === 'ADMIN' && userToDelete.role === 'ADMIN' && adminUser.uid !== id) {
            return res.status(403).send(
                {
                    success: false,
                    message: 'You cannot delete another ADMIN.'
                }
            )
        }

        //Si el usuario se está eliminando a sí mismo, validar la contraseña
        if (adminUser.uid === id) {
            if (!password) {
                return res.status(400).send(
                    {
                        success: false,
                        message: 'Password is required to delete your account'
                    }
                )
            }

            const isMatch = await checkPassword(userToDelete.password, password)
            if (!isMatch) {
                return res.status(400).send(
                    {
                        success: false,
                        message: 'Incorrect password, cannot delete the user'
                    }
                )
            }
        }

        // Eliminar usuario
        await User.findByIdAndDelete(id)

        return res.send(
            {
                success: true,
                message: `Account ${userToDelete.name} deleted successfully`
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error when deleting user',
                err
            }
        )
    }
}

//Actualizar contraseña
export const updatePassword = async (req, res) => {
    try {
        const { id } = req.params
        const { currentPassword, newPassword } = req.body

        if (id !== req.user.uid) {
            return res.status(403).send(
                {
                    success: false,
                    message: 'You are not authorized to update this password. :('
                }
            )
        }

        const user = await User.findById(id)
        if (!user) return res.status(404).send(
            {
                success: false,
                message: 'User not found'
            }
        )


        const isMatch = await checkPassword(user.password, currentPassword)
        if (!isMatch) return res.status(400).send(
            {
                message: 'Incorrect password',
                success: false
            }
        )

        if (currentPassword === newPassword) {
            return res.status(400).send(
                {
                    success: false,
                    message: 'New password cannot be the same as the current password jeje :) .'
                }
            )
        }

        user.password = await encrypt(newPassword)
        await user.save()

        return res.send(
            {
                success: true,
                message: 'Password updated successfully'
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
            success: false,
            message: 'General error',
            err
            }
        )
    }
}


//Obtener todas las categorias
export const getAll = async(req, res)=>{
    const { limit , skip } = req.query
    try {
        const users = await User.find()
            .skip(skip)
            .limit(limit)
        if(users.length === 0){
            return res.send(
                {
                    success: false,
                    message: 'Users not Found :('
                }
            )
        }
        return res.send(
            {
                success: true,
                message: 'Users found :)',
                total: users.length,
                users
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General Error',
                err
            }
        )
    }
}

// Obtener historial de compras de un usuario
export const getPurchaseHistory = async (req, res) => {
    try {
        const userId = req.user.uid  

        // Verificar si el usuario existe
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found.'
            })
        }

        // Obtener las facturas asociadas al usuario, con populate para obtener los detalles de los productos
        const invoices = await Invoice.find({ user: userId })
            .populate(
                {
                    path: 'user',
                    select: 'name -_id'
                }
            )
            .populate(
                {
                    path: 'products.product',
                    select: 'name price -_id'  
                }
            )


        if (!invoices || invoices.length === 0) {
            return res.status(404).send(
                {
                    success: false,
                    message: 'No purchase history found.'
                }
            )
        }

        return res.send(
            {
                success: true,
                message: 'Purchase history retrieved successfully.',
                invoices
            }
        )

    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'Error retrieving purchase history.',
                err
            }
        )
    }
}

