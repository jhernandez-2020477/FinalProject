//Lógica de Carrito
import Cart from '../cart/cart.model.js'
import Product from '../product/product.model.js'
import Invoice from '../invoice/invoice.model.js'

// Agregar Producto
export const addProductToCart = async (req, res) => {
    try {
        const { product, amount } = req.body
        const userId = req.user.uid
  
        // Verificar si el producto existe
        const productFound = await Product.findById(product)
        if (!productFound) {
            return res.status(400).send(
                {
                    success: false,
                    message: 'Product not found, cannot be added to cart.'
                }
            )
        }

        // Verificar si hay suficiente stock
        if (productFound.stock < amount) {
            return res.status(400).send(
                {
                    success: false,
                    message: 'Not enough stock available.'
                }
            )
        }

        // Buscar el carrito del usuario
        let cart = await Cart.findOne({ user: userId })
  
        // Si el carrito no existe, se crea
        if (!cart) {
            cart = new Cart(
                {
                    user: userId,
                    products: [{ product, amount }],
                    totalPrice: productFound.price * amount,
                    status: 'INCOMPLETE'
                }
            )
            await cart.save()
        } else {
            // Si el carrito está en estado COMPLETED, cambiarlo a INCOMPLETE
            if (cart.status === 'COMPLETE') {
                cart.status = 'INCOMPLETE'
            }

            // Verificar si el producto ya existe en el carrito
            const existingProduct = cart.products.find(item => item.product.toString() === product)
            if (existingProduct) {
                return res.send(
                    {
                        success: true,
                        message: 'The product has already been added to the cart.'
                    }
                )
            }
  
            // Si el producto no está en el carrito, se agrega
            cart.products.push({ product, amount })
            cart.totalPrice += productFound.price * amount
            await cart.save()
        }

        // Restar la cantidad del producto al stock
        productFound.stock -= amount
        await productFound.save() // Guardar los cambios en el producto

        return res.send(
            {
                success: true,
                message: 'Product added to cart successfully.',
                cart
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'Error adding product to cart.',
                error: err.message
            }
        )
    }
}

// Editar Producto en el carrito
export const updateProductInCart = async (req, res) => {
    try {
        const { product, newAmount } = req.body
        const userId = req.user.uid

        // Verificar si el carrito existe para el usuario
        let cart = await Cart.findOne({ user: userId })
        if (!cart) {
            return res.status(404).send(
                {
                    success: false,
                    message: 'Cart not found for the user.'
                }
            )
        }

        // Verificar si el producto está en el carrito
        const productInCart = cart.products.find(item => item.product.toString() === product)
        if (!productInCart) {
            return res.status(404).send(
                {
                    success: false,
                    message: 'Product not found in your cart.'
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

        // Calcular la diferencia entre la cantidad anterior y la nueva
        const previousAmount = productInCart.amount // Cantidad anterior en el carrito
        const stockDifference = newAmount - previousAmount // Diferencia entre la nueva y la anterior cantidad
        console.log(stockDifference)
        // Verificar si hay suficiente stock disponible para la nueva cantidad
        if (productFound.stock - stockDifference < 0) {
            return res.status(400).send(
                {
                    success: false,
                    message: 'Not enough stock available for the new quantity.'
                }
            )
        }

        // Actualizar el stock del producto: 
        // Si la cantidad disminuye en el carrito, sumamos la diferencia al stock.
        // Si la cantidad aumenta, restamos la diferencia del stock.
        productFound.stock -= stockDifference
        await productFound.save() // Guardar el cambio en el stock

        // Actualizar la cantidad del producto en el carrito
        productInCart.amount = newAmount

        // Actualizar el precio total en el carrito
        const productDetails = await Promise.all(
            cart.products.map(async (item) => {
                const product = await Product.findById(item.product)
                return product.price * item.amount
            })
        )
        cart.totalPrice = productDetails.reduce((total, price) => total + price, 0)

        await cart.save()

        return res.send(
            {
                success: true,
                message: 'Product quantity updated successfully.',
                cart
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'Error editing product in cart.',
                error: err.message
            }
        )
    }
}

//Eliminar el producto
export const deleteProductInCart = async(req, res) => {
    try {
        const { product } = req.body
        const userId = req.user.uid

        // Verificar si el carrito existe para el usuario
        let cart = await Cart.findOne({ user: userId })
        if (!cart) {
            return res.status(404).send(
                {
                    success: false,
                    message: 'Cart not found for the user.'
                }
            )
        }

        // Verificar si el producto está en el carrito
        const productInCartIndex = cart.products.findIndex(item => item.product.toString() === product)
        if (productInCartIndex === -1) {
            return res.status(404).send(
                {
                    success: false,
                    message: 'Product not found in your cart.'
                }
            )
        }

        // Obtener el producto de la base de datos
        const productFound = await Product.findById(product)
        if (!productFound) {
            return res.status(400).send(
                {
                    success: false,
                    message: 'Product not found :('
                }
            )
        }

        // Obtener la cantidad del producto para regresarlo al stock
        const previousAmount = cart.products[productInCartIndex].amount
        console.log(previousAmount)

        // Actualizar el stock del producto
        productFound.stock += previousAmount
        await productFound.save()

        // Eliminar el producto del carrito
        cart.products.splice(productInCartIndex, 1)

        // Actualizar el precio total en el carrito
        const productDetails = await Promise.all(
            cart.products.map(async (item) => {
                const product = await Product.findById(item.product)
                return product.price * item.amount
            })
        )
        cart.totalPrice = productDetails.reduce((total, price) => total + price, 0)

        await cart.save()

        return res.send(
            {
                success: true,
                message: 'Product deleted successfully.',
                cart
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General Error deleting product in cart',
                err
            }
        )
    }
}

//Completar el proceso de compra
export const completePurchase = async (req, res) => {
    try {
        const userId = req.user.uid

        // Verificar si el carrito existe para el usuario
        let cart = await Cart.findOne({ user: userId })
        if (!cart) {
            return res.status(404).send(
                {
                    success: false,
                    message: 'Cart not found for the user.'
                }
            )
        }

        // Verificar si el carrito ya está completado
        if (cart.status === 'COMPLETE') {
            return res.status(400).send(
                {
                    success: false,
                    message: 'The cart is already completed.'
                }
            )
        }

        // Cambiar el estado del carrito a "COMPLETE"
        cart.status = 'COMPLETE'

        // Crear la factura basada en el carrito
        const invoiceItems = []

        // Iterar sobre los productos del carrito para obtener los detalles
        for (const item of cart.products) {
            const product = await Product.findById(item.product)
            if (!product) {
                return res.status(400).send(
                    {
                        success: false,
                        message: 'Product not found in cart.'
                    }
                )
            }
            const price = product.price * item.amount
            invoiceItems.push({
                product: item.product,
                amount: item.amount,
                price: price
            })
        }

        // Crear la factura
        const invoice = new Invoice({
            user: userId, 
            products: invoiceItems, 
            total: cart.totalPrice, 
            date: new Date()  
        })

        // Guardar la factura
        await invoice.save()

        // Vaciar el carrito 
        cart.products = []
        cart.totalPrice = 0
        await cart.save()

        return res.send(
            {
                success: true,
                message: 'Purchase completed successfully.',
                invoice  
            }
        )

    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'Error completing purchase.',
                error: err.message
            }
        )
    }
}

