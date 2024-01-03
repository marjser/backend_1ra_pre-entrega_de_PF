const fs = require('fs');
const uuid4 = require('uuid4');


class Cart {
  id;
  products;
  path;
  
  constructor (path) {
      this.id = '';
      this.path = path
  }
  
  async newCart () {
          const data = await fs.promises.readFile(this.path, 'utf-8')
          const dataParse = JSON.parse(data)
          const carts = [...dataParse]

          const newCart = {
              id: uuid4(),
              products: []
          }


          carts.push(newCart)

          const jsonString = JSON.stringify(carts, null, 2);

          fs.writeFile(this.path, jsonString, 'utf8', (err) => {
              if (err) {
                  console.error('Error writing file:', err);
                  return;
              }
              console.log('File has been written successfully!')
          })   
          
  }



  async addProd (cid, pid) {
      if(fs.existsSync(this.path)) {
          const data = await fs.promises.readFile(this.path, 'utf-8')
          const cidN = cid
          const pidN = pid
          const dataParse = JSON.parse(data)
          const carts = [...dataParse]
          const cIndex = carts.findIndex(cart => cart.id === cidN) 
          const cart = carts.find(cart => cart.id === cidN)    
          const { products } = cart
          const pIndex = products.findIndex(obj => obj.product === pidN)


          if (!cart) {
              return 'Cart does not exists'
          }   else {

              if (!products.find(obj => obj.product === pidN)) {
                  products.push(
                      { product: pidN, quantity: 1 }
                  )
                  carts[cIndex].products = products
                  
              } else { 
                  ++carts[cIndex].products[pIndex].quantity
              }
          }

          const jsonString = JSON.stringify(carts, null, 2);
          
          fs.writeFile(this.path, jsonString, 'utf8', (err) => {
              if (err) {
              console.error('Error updating file:', err);
              return;
              }
            console.log('File has been updated successfully!')         
          });
      } 
  }

  async getCarts () {
      if(fs.existsSync(this.path)) {
          const data = await fs.promises.readFile(this.path, 'utf-8')
          const dataParse = JSON.parse(data)

          return dataParse
          } else {
          console.log('el archivo no existe')
          return console.error
          }      
  }

}



module.exports = Cart



