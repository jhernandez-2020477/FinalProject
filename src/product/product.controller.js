//Lógica de Producto
import Product from '../product/product.model.js'
import Category from '../category/category.model.js'

//Crear Producto
export const productRegister = async(req, res)=>{
    try{
        const { category } = req.body
        let data = req.body
        // Verificar si la categoría existe
        const categoryid = await Category.findById(category)
        if (!categoryid) {
            return res.status(400).send(
                {
                    success: false,
                    message: 'Category not found, cannot save this Product'
                }
            )
        }

        let product = new Product(data)
        await product.save()
        return res.send(
            {
                message: `Registred successfully, the added product is : ${product.name}`
            }
        )
    }catch(err){
        console.error(err)
        return res.status(500).send(
            {
                message: 'General Error with rigestering Product',
                err
            }
        )
    }
}

//Listar todos los productos
export const getAll = async(req, res)=>{
    try {
        const { limit = 20, skip = 0} = req.query
        const products = await Product.find()
            .skip(skip)
            .limit(limit)
        if(products.length === 0) return res.status(400).send(
            {
                success: false,
                message: 'Products not found'
            }
        )
        return res.send(
            {
                success: true,
                message: 'Products found',
                total: products.length,
                products
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

//Buscar 1 Producto
export const get = async(req, res)=>{
    try {
        const { id } = req.params
        const product = await Product.findById(id)
        if(!product) return res.status(404).send(
            {
                success: false,
                message: 'Product not Found'
            }
        )
        return res.send(
            {
                success: true,
                message: 'Product Found',
                product
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

//Actualizar Producto
export const update = async(req, res) => {
    const { id } = req.params
    const { category, ...data } = req.body // asumiendo que el id de la categoría se pasa en el body
    try {
        // Verificar si la categoría existe
        const categoryid = await Category.findById(category)
        if (!categoryid) {
            return res.status(400).send(
                {
                    success: false,
                    message: 'Category not found, cannot update product'
                }
            )
        }
        const updateProduct = await Product.findByIdAndUpdate(
            id,
            data,
            { new: true }
        )
        
        if (!updateProduct) {
            return res.status(404).send(
                {
                    success: false,
                    message: 'Product not found, not updated'
                }
            )
        }

        return res.send(
            {
                success: true,
                message: 'Product updated successfully :)',
                updateProduct
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error when adding Products',
                err
            }
        )
    }
}


//Eliminar Producto
export const deleteProduct = async(req, res)=>{
    try {
        const { id } = req.params
        const product = await Product.findById(id)
        if(!product) return res.status(404).send(
            {
                success: false,
                message: 'Product not found'
            }
        )
        await product.save()
        await Product.findByIdAndDelete(id)
        return res.send(
            {
                success: true,
                message: 'Product deleted successfully :)'
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

//Buscar Producto por nombre
export const getProductByName = async(req, res)=>{
    const { name } = req.params
    try {
        const product = await Product.find(
            {
                name: { $regex: name, $options: 'i'}
            }
        )
        .populate(
            {
                path: 'category',
                select: 'name description -_id'
            }
        )
        if(product.length === 0){
            return res.status(400).send(
                {
                    success: false,
                    message: 'No Products found with that name',
                }
            )
        }
        return res.send(
            {
                success: true,
                message: 'Product(s) found.',
                products: product
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

// Obtener productos más vendidos
export const getSellingProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .sort({ sales: -1 })
            .limit(10)
            .populate(
                {
                    path: 'category',
                    select: 'name description -_id'
                }
            )
        if(products.length === 0){
            return res.status(400).send(
                {
                    success: false,
                    message: 'No products found'
                }
            )
        }

        return res.send(
            {
                success: true,
                message: 'Top selling products found',
                products
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

// Obtener productos por categoría
export const getProductsByCategory = async (req, res) => {
    const { categoryId } = req.params
    try {
        const products = await Product.find({ category: categoryId })

        if (products.length === 0) {
            return res.status(400).send(
                {
                    success: false,
                    message: 'No products found for this category'
                }
            )
        }

        return res.send(
            {
                success: true,
                message: 'Products found for the category',
                products
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

// Obtener productos agotados
export const getOutOfStockProducts = async (req, res) => {
    try {
        const outOfStockProducts = await Product.find({ stock: 0 })

        if(outOfStockProducts.length === 0){
            return res.status(400).send(
                {
                    success: false,
                    message: 'No out-of-stock products found'
                }
            )
        }

        return res.send(
            {
                success: true,
                message: 'Out-of-stock products found',
                products: outOfStockProducts
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
