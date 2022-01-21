const ContenedorSql = require ('../contenedores/contenedorsql')

const {options} = require( '../options/SQLite3.js');

const PERSISTENCIA_MENSAJES = 'SQL'

let mensajesDao
switch (PERSISTENCIA_MENSAJES) {
    case 'SQL':
        mensajesDao = new ContenedorSql(options)
        break
    default:
        mensajesDao = new ContenedorSql(options)
}

function getMensajesDao() {
    return  mensajesDao 
}

module.exports = {
    getMensajesDao
  }
