const {mostrarInfo, listaProductos, calculo, listarUser, guardarUser, validarPassword} = require('../negocio/funciones');

const logger = require('../winston-module.js')

  /* ------------------ PASSPORT -------------------- */
  

  const passport = require('passport');
  const { Strategy: LocalStrategy } = require('passport-local');
  
  
  passport.use('register', new LocalStrategy({
      passReqToCallback: true
    }, async (req, username, password, done) => {
    
    let usuarios = await listarUser()
    const usuario = usuarios.find(usuario => usuario.username == username)
    
      if (usuario) {
        return done((null, false))
     }
    
      const user = {
        username,
        password,
      }
    
    try{
      guardarUser(username,password)
     }catch (error) {
        //console.log(`Error en operación de base de datos ${error}`)
        logger.error(`Error: ${error}`);
    }
    
      return done(null, user)
    }));
    
    const bCrypt = require('bcrypt');
    passport.use('login', new LocalStrategy(async (username, password, done) => {
    
      let usuarios =  await listarUser()
      const user = usuarios.find(usuario => usuario.username == username)
    
      if (!user) {
        return done(null, false)
      }
    
      if (validarPassword(user.password, password)) {
        return done(null, false)
      }
    
      return done(null, user);
    }));
    
    passport.serializeUser(function (user, done) {
      done(null, user.username);
    });
    
    passport.deserializeUser(async function (username, done) {
      let usuarios = await listarUser()
      const usuario = usuarios.find(usuario => usuario.username == username)
      done(null, usuario);
    });


async function info (req, res) {
  const { url, method } = req
  //console.log(`Ruta ${method} ${url} funcionando correctamente`)
  logger.info(`Ruta ${method} ${url} funcionando correctamente`)
  const infototal = await mostrarInfo()
  res.json({infototal})  
}

function noImplement(req, res) {
  const { url, method } = req
  logger.warn(`Ruta ${method} ${url} no implementada`)
  res.send(`Ruta ${method} ${url} no está implementada`)
}

async function productosFaker(req, res) {
    const { url, method } = req
    logger.info(`Ruta ${method} ${url} funcionando correctamente`)
    const productos = await listaProductos()
    res.render('./listaProductos',{productos});
}

async function calculoRandom(req, res)  {
    const { url, method } = req
    logger.info(`Ruta ${method} ${url} funcionando correctamente`) 
   // const random = fork(path.resolve(__dirname, 'randoms.js'))
    const { cant } = req.query 
    if (cant==undefined){
      //random.send(100000000)
      const resultado = await calculo(100000000)
      res.json({ resultado })
    }else{
      //random.send(Number(cant))
      const resultado = await calculo(Number(cant))
      res.json({ resultado })
    }  
    /*random.on('message', resultado => {
        res.json({ resultado, puerto})
    })*/
  }
  
  function registro (req, res) {
    const { url, method } = req
    logger.info(`Ruta ${method} ${url} funcionando correctamente`)
    res.sendFile('C:/Users/ArielMatias/Curso Backend MERN/38Desafio/public/plantillas/register.html')
  }

  function  errorRegistro(req, res) {
    const { url, method } = req
    logger.info(`Ruta ${method} ${url} funcionando correctamente`)
    res.render('register-error');
  }

  function login(req, res) {
    res.sendFile('C:/Users/ArielMatias/Curso Backend MERN/38Desafio/public/login.html')
    const { url, method } = req
    logger.info(`Ruta ${method} ${url} funcionando correctamente`)
  }

  function errorLogin(req, res) {
    const { url, method } = req
    logger.info(`Ruta ${method} ${url} funcionando correctamente`)
    res.render('login-error');
  }

  function logout(req, res) {
    const { url, method } = req
    logger.info(`Ruta ${method} ${url} funcionando correctamente`)
    const nombre = req.user.username
    if (nombre) {
        req.session.destroy(err => {
            if (!err) {
                res.render('C:/Users/ArielMatias/Curso Backend MERN/38Desafio/public/plantillas/logout.hbs', { nombre })
                req.logout();
            } else {
                res.redirect('/')
            }
        })
    } else {
        res.redirect('/')
    }
  }

  function inicio(req, res) {
    res.render('C:/Users/ArielMatias/Curso Backend MERN/38Desafio/public/plantillas/index.hbs', {nombre: req.user.username} )
    console.log(req.user.username)
  }
  
module.exports = {
    info,
    noImplement,
    productosFaker,
    calculoRandom,
    registro,
    errorRegistro,
    login,
    errorLogin,
    logout,
    inicio,
}