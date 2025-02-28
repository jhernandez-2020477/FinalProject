//Lógica de la factura
import Invoice from '../invoice/invoice.model.js'
import Product from '../product/product.model.js'
import User from '../user/user.model.js'

//Editar Factura
export const updateProductInInvoice = async(req, res) => {
    try {
        const { product, newAmount } = req.body
        const { id } = req.params
        const userId = req.user.uid

        // Verificar si el usuario es ADMIN
        const user = await User.findById(userId)
        if (!user || user.role !== 'ADMIN') {
            return res.status(403).send(
                {
                    success: false,
                    message: 'You do not have permission to modify the invoice.'
                }
            )
        }

        // Verificar si la factura existe
        let invoice = await Invoice.findById(id)
        console.log(invoice)
        if (!invoice) {
            return res.status(404).send(
                {
                    success: false,
                    message: 'Invoice not found.'
                }
            )
        }

        // Verificar si el producto está en la factura
        const productInInvoice = invoice.products.find(item => item.product.toString() === product)
        if (!productInInvoice) {
            return res.status(404).send(
                {
                    success: false,
                    message: 'Product not found in this Invoice.'
                }
            )
        }

        // Obtener el producto de la base de datos
        const productFound = await Product.findById(product)
        if (!productFound) {
            return res.status(400).send(
                {
                    success: false,
                    message: 'Product not found.'
                }
            )
        }

        // Calcular la diferencia entre la cantidad anterior y la nueva cantidad
        const previousAmount = productInInvoice.amount
        const stockDifference = newAmount - previousAmount
        
        // Verificar si hay suficiente stock disponible para la nueva cantidad
        if (productFound.stock - stockDifference < 0) {
            return res.status(400).send(
                {
                    success: false,
                    message: 'Not enough stock available for the new quantity.'
                }
            )
        }

        // Actualizar el stock del producto
        // Si la cantidad disminuye en la factura, sumamos la diferencia al stock
        // Si la cantidad aumenta, restamos la diferencia al stock
        productFound.stock -= stockDifference
        await productFound.save()

        // Actualizar la cantidad del producto en la factura
        productInInvoice.amount = newAmount

        // Actualizar el precio total en la factura
        const productDetails = await Promise.all(
            invoice.products.map(async (item) => {
                const product = await Product.findById(item.product)
                return product.price * item.amount
            })
        )
        invoice.total = productDetails.reduce((total, price) => total + price, 0)

        await invoice.save()

        return res.send(
            {
                success: true,
                message: 'Product quantity updated successfully.',
                invoice
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'Error editing product in invoice',
                err
            }
        )
    }
}

// Obtener las facturas de un usuario esto es solo para admin
export const getInvoicesByUser = async (req, res) => {
    try {
        const userId = req.user.uid 

        // Verificar si el usuario es ADMIN
        const user = await User.findById(userId)
        if (!user || user.role !== 'ADMIN') {
            return res.status(403).send(
                {
                    success: false,
                    message: 'You do not have permission to view the invoices.'
                }
            )
        }

        // Verificar si el usuario al que se le piden las facturas existe
        const requestedUserId = req.params.userId 
        const requestedUser = await User.findById(requestedUserId)

        if (!requestedUser) {
            return res.status(404).send(
                {
                    success: false,
                    message: 'User not found.'
                }
            )
        }

        // Buscar las facturas asociadas al usuario específico y obtener los detalles de los productos
        const invoices = await Invoice.find({ user: requestedUserId })
            .populate(
                {
                    path: 'user',
                    select: 'name -_id'

                }
            )
            .populate(
                {
                    path: 'products.product',
                    select: 'name -_id'

                }
            )
        if (invoices.length === 0) {
            return res.status(404).send(
                {
                    success: false,
                    message: 'No invoices found for this user.'
                }
            )
        }

        return res.send(
            {
                success: true,
                message: 'Invoices retrieved successfully.',
                invoices
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'Error fetching invoices.',
                err
            }
        )
    }
}

