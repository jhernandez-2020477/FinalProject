//Lógica de Carrito
import Cart from '../cart/cart.model.js'
import Product from '../product/product.model.js'

// Agregar Producto
export const addProductToCart = async (req, res) => {
    try {
        const { product, amount } = req.body
        const userId = req.user.uid
  
        // Verificar si el producto existe
        const productFound = await Product.findById(product)
        if(!productFound){
        return res.status(400).send(
                {
                    success: false,
                    message: 'Product not found, cannot be added to cart.'
                }
            )
        }
  
        // Buscar el carrito del usuario
        let cart = await Cart.findOne({ user: userId })
  
        // Si el carrito no existe, se creá
        if(!cart){
            cart = new Cart(
                {
                    user: userId,
                    products: [{ product, amount }],
                    totalPrice: productFound.price * amount
                }
            )
            await cart.save()
            return res.send(
                {
                    success: true,
                    message: 'Cart created and product added successfully.',
                    cart
                }
            )
        }
  
        // Verificar si el producto ya existe en el carrito
        const existingProduct = cart.products.find(item => item.product.toString() === product)
  
        if(existingProduct){
            return res.send(
                {
                    success: true,
                    message: 'The product has already been added to the cart.'
                }
            )
        }
  
        // Si el producto no está en el carrito se agregá
        cart.products.push({ product, amount })
        cart.totalPrice += productFound.price * amount //Se actualiza el precio total
  
        await cart.save()
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