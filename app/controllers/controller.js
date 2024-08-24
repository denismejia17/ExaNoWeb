

const db = require('../config/db.config.js');
const Customer = db.Customer;

exports.create = (req, res) => {
    let customer = {};

    try{
        // Building Customer object from upoading request's body
        customer.codigo = req.body.codigo;
        customer.nombre = req.body.nombre;
        customer.editorial = req.body.editorial;
        customer.autor = req.body.autor;
        customer.genero = req.body.genero;
        customer.pais = req.body.pais;
        customer.paginas = req.body.paginas;
        customer.fecha = req.body.fecha;
        customer.anio = req.body.anio;
        customer.precio=req.body.precio;
        // Save to MySQL database
        Customer.create(customer).then(result => {    
            // send uploading message to client
            res.status(200).json({
                message: "Upload Successfully a Book with id = " + result.id,
                customer: result,
            });
        });
    }catch(error){
        res.status(500).json({
            message: "Fail!",
            error: error.message
        });
    }
}

exports.retrieveAllCustomers = (req, res) => {
    // find all Customer information from 
    Customer.findAll()
        .then(customerInfos => {
            res.status(200).json({
                message: "Get all Books' Infos Successfully!",
                customers: customerInfos
            });
        })
        . catch(error => {
          // log on console
          console.log(error);

          res.status(500).json({
              message: "Error!",
              error: error
          });
        });
}

exports.getCustomerById = (req, res) => {
  // find all Customer information from 
  let customerId = req.params.id;
  Customer.findByPk(customerId)
      .then(customer => {
          res.status(200).json({
              message: " Successfully Get a Book with id = " + customerId,
              customers: customer
          });
      })
      . catch(error => {
        // log on console
        console.log(error);

        res.status(500).json({
            message: "Error!",
            error: error
        });
      });
}


exports.filteringByAge = (req, res) => {
  let anio = req.query.anio;

    Customer.findAll({
                      attributes: ['id', 'codigo', 'nombre', 'editorial', 'autor', 'genero', 'pais', 'paginas', 'anio','precio'],
                      where: {anio: anio}
                    })
          .then(results => {
            res.status(200).json({
                message: "Get all Book with anio = " + anio,
                customers: results,
            });
          })
          . catch(error => {
              console.log(error);
              res.status(500).json({
                message: "Error!",
                error: error
              });
            });
}
 
exports.pagination = (req, res) => {
  try{
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
  
    const offset = page ? page * limit : 0;
  
    Customer.findAndCountAll({ limit: limit, offset:offset })
      .then(data => {
        const totalPages = Math.ceil(data.count / limit);
        const response = {
          message: "Paginating is completed! Query parameters: page = " + page + ", limit = " + limit,
          data: {
              "totalItems": data.count,
              "totalPages": totalPages,
              "limit": limit,
              "currentPageNumber": page + 1,
              "currentPageSize": data.rows.length,
              "customers": data.rows
          }
        };
        res.send(response);
      });  
  }catch(error) {
    res.status(500).send({
      message: "Error -> Can NOT complete a paging request!",
      error: error.message,
    });
  }    
}

exports.pagingfilteringsorting = (req, res) => {
  try{
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    let anio = parseInt(req.query.anio);
  
    const offset = page ? page * limit : 0;

    console.log("offset = " + offset);
  
    Customer.findAndCountAll({
                                attributes: ['id', 'codigo', 'nombre', 'editorial', 'autor', 'genero', 'pais', 'paginas', 'anio','precio'],
                                where: {anio: anio}, 
                                order: [
                                  ['libro', 'ASC'],
                                  ['autor', 'DESC']
                                ],
                                limit: limit, 
                                offset:offset 
                              })
      .then(data => {
        const totalPages = Math.ceil(data.count / limit);
        const response = {
          message: "Pagination Filtering Sorting request is completed! Query parameters: page = " + page + ", limit = " + limit + ", anio = " + anio,
          data: {
              "totalItems": data.count,
              "totalPages": totalPages,
              "limit": limit,
              "age-filtering": anio,
              "currentPageNumber": page + 1,
              "currentPageSize": data.rows.length,
              "customers": data.rows
          }
        };
        res.send(response);
      });  
  }catch(error) {
    res.status(500).send({
      message: "Error -> Can NOT complete a paging request!",
      error: error.message,
    });
  }      
}

exports.updateById = async (req, res) => {
    try{
        let customerId = req.params.id;
        let customer = await Customer.findByPk(customerId);
    
        if(!customer){
            // return a response to client
            res.status(404).json({
                message: "Not Found for updating a book with id = " + customerId,
                customer: "",
                error: "404"
            });
        } else {    
            // update new change to database
            let updatedObject = {

                codigo : req.body.codigo,
                nombre : req.body.nombre,
                editorial : req.body.editorial,
                autor : req.body.autor,
                genero : req.body.genero,
                pais : req.body.pais,
                paginas : req.body.paginas,
                fecha : req.body.fecha,
                anio : req.body.anio,
                precio:req.body.precio,
            }
            let result = await Customer.update(updatedObject, {returning: true, where: {id: customerId}});
            
            // return the response to client
            if(!result) {
                res.status(500).json({
                    message: "Error -> Can not update a book with id = " + req.params.id,
                    error: "Can NOT Updated",
                });
            }

            res.status(200).json({
                message: "Update successfully a book with id = " + customerId,
                customer: updatedObject,
            });
        }
    } catch(error){
        res.status(500).json({
            message: "Error -> Can not update a book with id = " + req.params.id,
            error: error.message
        });
    }
}

exports.deleteById = async (req, res) => {
    try{
        let customerId = req.params.id;
        let customer = await Customer.findByPk(customerId);

        if(!customer){
            res.status(404).json({
                message: "Does Not exist a book with id = " + customerId,
                error: "404",
            });
        } else {
            await customer.destroy();
            res.status(200).json({
                message: "Delete Successfully a book with id = " + customerId,
                customer: customer,
            });
        }
    } catch(error) {
        res.status(500).json({
            message: "Error -> Can NOT delete a book with id = " + req.params.id,
            error: error.message,
        });
    }
}