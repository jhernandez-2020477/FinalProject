//Lógica de la factura
import Invoice from '../invoice/invoice.model.js'
import Product from '../product/product.model.js'
import User from '../user/user.model.js'

// Editar Factura
export const updateProductInInvoice = async (req, res) => {
    try {
        const { product, newAmount } = req.body
        const { id } = req.params
        const userId = req.user.uid

        // Verificar si el usuario es ADMIN
        const user = await User.findById(userId)
        if(!user || user.role !== 'ADMIN'){
            return res.status(403).send(
                {
                    success: false,
                    message: 'You do not have permission to modify the invoice.'
                }
            )
        }

        // Verificar si la factura existe
        let invoice = await Invoice.findById(id)
        if(!invoice){
            return res.status(404).send(
                {
                    success: false,
                    message: 'Invoice not found.'
                }
            )
        }

        // Verificar si el producto está en la factura
        const productInInvoice = invoice.products.find(item => item.product.toString() === product)
        if(!productInInvoice){
            return res.status(404).send(
                {
                    success: false,
                    message: 'Product not found in this invoice.'
                }
            )
        }

        // Obtener el producto de la base de datos
        const productFound = await Product.findById(product)
        if(!productFound){
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

        // Verificar si hay suficiente stock disponible
        if(productFound.stock - stockDifference < 0){
            return res.status(400).send(
                {
                    success: false,
                    message: `Not enough stock available for the new quantity. Available stock is: ${productFound.stock}`
                }
            )
        }

        // Actualizar el stock y las ventas del producto
        productFound.stock -= stockDifference
        productFound.sales += stockDifference // Aqui va a incrementar o disminuyir las ventas según la diferencia
        await productFound.save()

        // Actualizar la cantidad y el precio en la factura
        productInInvoice.amount = newAmount
        productInInvoice.price = productFound.price * newAmount

        // Recalcular el subTotal de la factura
        const subTotal = invoice.products.reduce((total, item) => total + item.price, 0)

        // Calcular el IVA (12%) y el total
        const iva = subTotal * 0.12
        const total = subTotal + iva

        // Actualizar la factura
        invoice.subTotal = subTotal
        invoice.total = total

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

