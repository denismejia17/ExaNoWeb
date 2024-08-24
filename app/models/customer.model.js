
module.exports = (sequelize, Sequelize) => {
	const Customer = sequelize.define('customer', {	
	  id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
    },
	  codigo: {
			type: Sequelize.INTEGER
	  },
	  nombre: {
			type: Sequelize.STRING
  	},
	  editorial: {
			type: Sequelize.STRING
	  },
	  autor: {
			type: Sequelize.STRING
    },
	  genero: {
		type: Sequelize.STRING
  },
  pais: {
		type: Sequelize.STRING
  },
  paginas: {
		type: Sequelize.INTEGER
},
anio: {
	type: Sequelize.INTEGER
},
precio: {
type: Sequelize.FLOAT
}
}
)
;
	
	return Customer;
}