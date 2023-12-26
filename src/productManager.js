const fs = require('fs')


class ProductManager {

    id;
    products;
    path;
    
    
    constructor(productManager, path){

        this.productManager = productManager; 
        this.id = 0;
        this.products = [];
        this.path = path

    };
    

    
    async addProduct ( objProducto ) {
        if (!objProducto.title || !objProducto.description || !objProducto.code || !objProducto.price || !objProducto.stock || !objProducto.category) {

            return 'Missing input data'
        } else {
          
            this.id++;
            const newProd = {
              id: this.id,
              productManager: this.productManager,
              status: true,
              ...objProducto 
            }

            if(!fs.existsSync(this.path)) {
              
                this.products.push(newProd)
              
                const jsonString = JSON.stringify(this.products, null, 2);
                
                fs.writeFile(this.path, jsonString, 'utf8', (err) => {

                    if (err) {
                        console.error('Error writing file:', err);
                        return;
                    }
                    console.log('File has been written successfully!')

                })        
                
                return 'Path created and product added'    
  
            } else {

                const data = await fs.promises.readFile(this.path, 'utf-8')
                const dataParse = JSON.parse(data)
                this.products = [...dataParse]
                    
                const newCode = this.products.find((product) => product.code === objProducto.code)
                
                if (newCode) {
                    console.log('ERROR: El código  ya se encuentra utilizado.')
                } else {
                  
                    let { id } = this.products[this.products.length - 1];
                    newProd.id = ++id
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

        let product = this.products.find(product => product.id === Number(pid))
        
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
            
            product.id = Number(pid)
            let index = this.products.findIndex(product => product.id === Number(pid))

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


        let index = this.products.findIndex(product => product.id === Number(pid))

        
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





