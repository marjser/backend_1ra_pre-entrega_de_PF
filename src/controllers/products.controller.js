const { Router } = require('express')
const ProductManager = require('../productManager')

const router = Router()

const productsPath = process.cwd() + '/src/data/products.json'
const productManager = new ProductManager('empresa', productsPath)

// Endpoint para obtener todos los productos agregados con el limitador

router.get('/', (req, res) => {
    const limit = req.query.limit

    if(!productManager.path) {
        return res.status(400).send({status:"error", error:"La ruta no existe"})
    }

    const product  = async () => {

        if (limit==undefined) {
            const products = await productManager.getProducts()
            res.json({payload: products})
        } else {
            const products = await productManager.getProducts()
            const num = Number(limit)
            products.length = num
            res.json({payload: products})
        }
    }
    product()
})

// Endpoint para buscar un producto por su id

router.get('/:pid', (req, res) => {
    const { pid } = req.params
    
    if(!productManager.path) {
        return res.status(400).send({status:"error", error:"La ruta no existe"})
    }
    

    productsId = async () =>{
        const products = await productManager.getProducts()   
        const product = products.find(product => product.id === pid)

        if (!product) {
            res.status(404).json({ error: 'Not found' })
        } else {
            res.json({payload: product})
        }

        //res.json({payload: product})
        
    }
    
    productsId()
    
})

// Endpoint que devuelve error 404 si hay una petición GET no definida

router.get('*', (req, res) => {
    res.status(404).json({ error: 'Not found' }) 
})

// Endpoint para agregar un nuevo producto

router.post('/', (req, res) => {

    const { title , description, code , price , stock , category , thumbnail} = req.body
    
    const newProduct = {
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnail,
    }

    const product  = async () => {
        const prodAdded = await productManager.addProduct(newProduct)
        res.json({payload: prodAdded})
    }
    product()

})

// Endpoint para actualizar un producto por su id.

router.put('/:pid', (req, res) => {
    const { pid } = req.params
    const newObj = {...req.body}
    
    update = async (pid, newObj) =>{
        await productManager.updateProduct(pid, newObj)
    }
    
    update(pid, newObj)
    res.json({payload: 'Product updated'})
})

// Endpoint para borrar un producto por su id-

router.delete('/:pid', (req, res) => {
    const { pid } = req.params

    const deleteProd = async () => {
        await productManager.deleteProduct(pid)
        res.json({payload: 'Product deleted'})
    }

    deleteProd()
})


module.exports = router