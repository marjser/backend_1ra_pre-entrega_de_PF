const { Router } = require('express')
const Cart = require('../cartControl')

const fs = require('fs')

const router = Router()


const cartPath = process.cwd() + '/src/data/carts.json'
const productsPath = process.cwd() + '/src/data/products.json'

const carrito = new Cart (cartPath)


// Endpoint que devuelve todos los carritos creados.

router.get('/', (req, res) => {
    
    const cart  = async () => {
        const carts = await carrito.getCarts()
        res.json({payload: carts})
    }
    cart()
})

// Endpoint que devuelve el carrito buscado por su id, con sus productos agregados, y cantidad que tiene agregados de cada uno.

router.get('/:cid', (req, res) => {

    const { cid } = req.params

    cartsId = async () =>{

        const carts = await carrito.getCarts()
        const productsJson = await fs.promises.readFile(productsPath, 'utf-8')
        const productsParsed = JSON.parse(productsJson)
        const cart = carts.find(cart => cart.id === cid)
    
        if (!carts || !productsJson || !cart) {
            res.status(404).json({ error: 'Not found' })
        } else {
            const { products } = cart
            const productsDisplay = []
            for (let index of products) {
                const { product, quantity } = index
    
                const prodId = productsParsed.find(prod => prod.id === product)
                prodId.quantity = quantity
    
                productsDisplay.push(prodId)
            }
            res.json({payload: productsDisplay})
            
        }    
    
    }

    if(!carrito.path || !fs.existsSync(productsPath)) {
        return res.status(400).send({status:"error", error:"Path does not exists"})
    } else {
        cartsId()
    }

})

// Endpoint que devuelve error 404 si se realiza una patición de GET no definida.

router.get('*', (req, res) => {
    res.status(404).json({ error: 'Not found' }) 
})

// Endpoint que crea un carrito

router.post('/', (req, res) => {

    const cart  = async () => {        
        const newCart = await carrito.newCart()
        res.json({payload: 'Carrito creado'})
    }
    cart()

})
 
// Endpoint que agrega un producto al Id seleccionado, tambien incrementa su cantidad.

router.post('/:cid/product/:pid', (req, res) => {

    const { cid, pid } = req.params
    

    const cart = async () => {
        const productsJson = await fs.promises.readFile(productsPath, 'utf-8')
        const productsParsed = JSON.parse(productsJson)

        if (!productsParsed.find(prod => prod.id === pid)) {
            return res.status(400).send({status:"error", error:"Incorrect Id Product"})
        } else {
            const newCart = await carrito.addProd(cid, pid)
            res.json({payload: 'Product added'})
        }
    }

    if(!carrito.path || !fs.existsSync(productsPath)) {
        return res.status(400).send({status:"error", error:"Path does not exists"})
    } else {
        cart()
    }

})



module.exports = router