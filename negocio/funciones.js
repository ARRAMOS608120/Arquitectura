const listarProductos = require('./generadorFaker.js')

const {listarUsuarios,guardarUsuario} = require('../persistencia/funciones');

function mostrarInfo(){
    const args = process.argv

    const argumentos = args.slice(2)
    const plataforma= process.platform
    const version= process.version
    const memoria= process.memoryUsage().rss
    const pathEje= process.execPath
    const pid= process.pid 
    const carpeta= process.cwd()
    
    const numCPUs = require('os').cpus().length;
    
    const info = {
      argumentos,
      plataforma,
      version,
      memoria,
      pathEje,
      pid,
      carpeta,
      numCPUs
    }

    return info
}

async function listaProductos(){
    return await listarProductos()
}

function calculo (cantidad)  {
    let numeros = {}
    for (let i = 0; i < cantidad; i++) {
        let azar = Math.floor(Math.random() * 1000) + 1
        if (numeros[azar]){
            numeros[azar]++;
        }else{
            numeros[azar] = 1
        }
    }
    return numeros
  }

async function listarUser(){
    return await listarUsuarios()
} 

const bCrypt = require('bcrypt');

function createHash(password){
  return bCrypt.hashSync(
      password,
      bCrypt.genSaltSync(10),
      null);
}

function validarPassword(password1, password2){
  return bCrypt.compareSync(password1, password2)
}
async function guardarUser(usuario, password){
  await guardarUsuario(usuario,createHash(password))
  console.log("Usuario agregado")
} 

module.exports = {
  mostrarInfo,
  listaProductos,
  calculo,
  listarUser,
  guardarUser,
  validarPassword
}