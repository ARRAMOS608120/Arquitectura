const isAuth = require ('./middleware/auth.js')

const logger = require('../winston-module.js')

const controlador = require('../controlador/controlador');

const compression = require('compression')

const { Router } = require ('express')
const router = new Router()

router.get('/info', compression(), controlador.info)

const passport = require('passport'); 

router.use(passport.initialize());
router.use(passport.session());

/* --------------------- ROUTES --------------------------- */
// REGISTER
router.get('/register', controlador.registro)
  
router.post('/register', passport.authenticate('register', { failureRedirect: '/failregister', successRedirect: '/' }))
  
router.get('/failregister', controlador.errorRegistro)

// LOGIN
router.get('/login', controlador.login)
  
router.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin', successRedirect: '/' }) )
  
router.get('/faillogin', controlador.errorLogin)

  /* --------- LOGOUT ---------- */

router.get('/logout', controlador.logout)
  
  /* --------- INICIO ---------- */
router.get('/', isAuth, controlador.inicio)

router.get('*', controlador.noImplement)

const routerApi = new Router()

routerApi.get('/productos-test',controlador.productosFaker)
routerApi.get('/randoms', controlador.calculoRandom)
  
  module.exports = {
    router,
    routerApi
}