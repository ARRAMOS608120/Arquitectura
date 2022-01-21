
const ContenedorSql = require ('../contenedores/contenedorsql')

const {options1} = require('../options/mariaDB');

const PERSISTENCIA_PRODUCTOS = 'SQL'

let productosDao
switch (PERSISTENCIA_PRODUCTOS) { 
    case 'SQL':
        productosDao = new ContenedorSql(options1)
        break
    default:
        productosDao = new ContenedorSql(options1)
}

 function getProductosDao() {
    return productosDao
}

module.exports = {
    getProductosDao,
  }
