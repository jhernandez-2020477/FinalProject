//Lógica de Producto
import Category from '../category/category.model.js'
import Product from '../product/product.model.js'

//Crear categoria por defecto
export const initCategory = async(req, res) => {
    try {
        // Verificar si ya existe una categoria con ese nombre
        let defaultCate = await Category.findOne(
            { 
                name: 'Category Default' 
            }
        )
        
        if (!defaultCate) {
            const categoryData = {
                name: 'Category Default',
                description: 'Esta es una categoria que engloba todas las demás'
            }

            let newCategory = new Category(categoryData)
            await newCategory.save();
            
            console.log('Category created successfully!')
        } else {
            //console.log('Category already exists!')
        }
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                message: 'Error creating Default Category', 
                err
            }
        )
    }
}


//Crear Producto
export const categoryRegister = async(req, res)=>{
    try{
        let data = req.body
        let category = new Category(data)
        await category.save()
        return res.send(
            {
                message: `Registred successfully,the added category is: ${category.name}`
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

//Obtener todas las categorias
export const getAll = async(req, res)=>{
    const { limit , skip } = req.query
    try {
        const categories = await Category.find()
            .skip(skip)
            .limit(limit)
        if(categories.length === 0){
            return res.send(
                {
                    success: false,
                    message: 'Categories not Found :('
                }
            )
        }
        return res.send(
            {
                success: true,
                message: 'Categories found :)',
                total: categories.length,
                categories
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

//Actualizar Categoria
export const update = async(req, res)=>{
    const { id } = req.params
    const { ...data } = req.body
    try {
        const updateCategory = await Category.findByIdAndUpdate(
            id,
            data,
            {new: true}
        )
        if(!updateCategory) return res.status(404).send(
            {
                success: false,
                message: 'Category not found, not updated'
            }
        )
        return res.send(
            {
                success: true,
                message: 'Category updated successfully :)',
                updateCategory
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error when adding Category',
                err
            }
        )
    }
}



// Eliminar Categoria y actualizar productos
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params
        
        // Buscar la categoría a eliminar
        const category = await Category.findById(id)
        if (!category) {
            return res.status(404).send(
                {
                    success: false,
                    message: 'Category not found'
                }
            )
        }

        //Verificar que no sea la categoria por default
        if(category.name === 'Category Default'){
            return res.status(400).send(
                {
                    success: false,
                    message: 'Cannot delete the Category Default'
                }
            )
        }

        // Buscar la categoría por defecto
        let defaultCategory = await Category.findOne(
            { 
                name: 'Category Default' 
            }
        )
        
        if (!defaultCategory) {
            return res.status(400).send(
                {
                    success: false,
                    message: 'No available category to assign products'
                }
            )
        }

        // Actualizar los productos que pertenecen a la categoría eliminada
        const updatedProducts = await Product.updateMany(
            { category: id },
            { $set: { category: defaultCategory._id } }
        )

        console.log(`Updated ${updatedProducts.modifiedCount} products to category ${defaultCategory._id}`)

        // Eliminar la categoría
        await Category.findByIdAndDelete(id)

        return res.send(
            {
                success: true,
                message: 'Category deleted successfully and products reassigned :)',
                updatedProducts: updatedProducts.modifiedCount
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
