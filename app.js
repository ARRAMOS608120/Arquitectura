const express = require('express');
const { Server: HttpServer } = require('http');
const { Server: Socket } = require('socket.io');
const  exphbs  = require('express-handlebars');
const routerRandoms = require('./routers/routerRandom.js')
const routerInfo = require('./routers/routerInfo.js')
const routerUsers = require('./routers/routerUsers')
const mdw = require('./routers/midlewars/auth')
const routerApi = require('./routers/routerApi.js');

// ---------- Necesarios aca para socket ------------------
const apiProductos = require('./negocio/productos.js'); 
const apiMensajes = require('./negocio/mensajes.js');
const utils = require('./negocio/utils/normalizador.js');

// ------------ Logger config ---------------
const loggerModule = require('./negocio/utils/log4js.js');
const logger = loggerModule()

const app = express();
const httpServer = new HttpServer(app);
const io =  new Socket(httpServer);


io.on('connection', async socket => {
    const productos = await apiProductos.obtenerProd();
    const mensajes = await apiMensajes.obtenerMensajes();
    const mjesNormalizados = utils.normalizar(mensajes)
    socket.emit('productos', productos);
    socket.emit('mensajes', mjesNormalizados);
    
    socket.on('update-prod', async (producto) => {
        await apiProductos.guardarProducto(producto);
        const p = await apiProductos.obtenerProd();
        io.sockets.emit('productos', p);
    })
    
    socket.on('mensaje', async (data) => {
        await apiMensajes.guardarMensaje(data);
        const m = await apiMensajes.obtenerMensajes();
        const mjesNormal = utils.normalizar(m)
        io.sockets.emit('mensajes', mjesNormal);
    }) 
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('./public'));

app.use((req,res,next) => {
  logger.info(`${req.method} a '${req.originalUrl}': ${new Date()}`)
  next();
})

// ---------- config handlebars -----------------
app.engine('hbs', exphbs({
  extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials"
  }))
app.set('views', __dirname +  '/views')
app.set('view engine', 'hbs')
// ---------- config handlebars -----------------
  
app.use('/randoms', routerRandoms)
app.use('/info', routerInfo)
app.use('/users', routerUsers)

app.use('/api', routerApi)

// ---------------------------rutas no manejadas -----------------------------------
app.use(mdw.pathError)

app.use(mdw.notImplemented)

module.exports = httpServer