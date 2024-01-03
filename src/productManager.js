const fs = require('fs')
const uuid4 = require('uuid4')



class ProductManager {

    id;
    products;
    path;
    
    
    constructor(productManager, path){

        this.productManager = productManager; 
        this.id = '';
        this.products = [];
        this.path = path

    };
    

    
    async addProduct ( objProducto ) {
        if (!objProducto.title || !objProducto.description || !objProducto.code || !objProducto.price || !objProducto.stock || !objProducto.category) {

            return 'Missing input data'
        } else {
          
            const newProd = {
              id: uuid4(),
              productManager: this.productManager,
              status: true,
              ...objProducto 
            }

                const data = await fs.promises.readFile(this.path, 'utf-8')
                const dataParse = JSON.parse(data)
                this.products = [...dataParse]
                    
                const newCode = this.products.find((product) => product.code === objProducto.code)
                
                if (newCode) {
                    console.log('ERROR: El código  ya se encuentra utilizado.')
                } else {

                    this.products.push(newProd)
                  
                    const jsonString = JSON.stringify(this.products, null, 2);
                    
                    fs.writeFile(this.path, jsonString, 'utf8', (err) => {
                        if (err) {
                            console.error('Error writing file:', err);
                            return;
                        }
                        console.log('File has been written successfully!')
                    })        
                }
                    
                return 'Product added'
        }
    }
    
    
    async getProducts ()  {
        if(fs.existsSync(this.path)) {

            const data = await fs.promises.readFile(this.path, 'utf-8')
            const dataParse = JSON.parse(data)
            return dataParse

        } else {

            console.log('el archivo no existe')
            return console.error

        }      
    }
    
    async updateProduct (pid, newObj) {

        const data = await fs.promises.readFile(this.path, 'utf-8')
        const dataParse = JSON.parse(data)
        this.products = [...dataParse]
        let newCode 

        let product = this.products.find(product => product.id === pid)
        
        if (newObj.code)  { //Verifica en caso de haber un código a modificar, sino está siento utilizado por otro producto.
            if (this.products.find((prod) => prod.code === newObj.code)){
                newCode = product.code
            }
        }

        if (newCode) {
            
            console.log('ERROR: El código  ya se encuentra utilizado.')
            
        } else {

            for (let prop in product) {
    
                if (newObj[prop]) { 
                    
                    product[prop] = newObj[prop]
                    
                }
            }
            
            product.id = pid
            let index = this.products.findIndex(product => product.id === pid)

            this.products[index] = product

            const jsonString = JSON.stringify(this.products, null, 2);
        
            fs.writeFile(this.path, jsonString, 'utf8', (err) => {
 
            if (err) {

                console.error('Error updating file:', err);
                return;

            }

            console.log('File has been updated successfully!')   

            });
        }
    }

    // Método para borrar productos

    async deleteProduct (pid) {

        const data = await fs.promises.readFile(this.path, 'utf-8')
        const dataParse = JSON.parse(data)
        this.products = [...dataParse]


        let index = this.products.findIndex(product => product.id === pid)

        
        if (index != -1) {
            
            const deleted = this.products.splice(index, 1)
            
            const jsonString = JSON.stringify(this.products, null, 2);
          
            fs.writeFile(this.path, jsonString, 'utf8', (err) => {

                if (err) {
                console.error('Error updating file:', err);
                return;

                }

                return deleted
            });
        }
    }
}

module.exports = ProductManager





