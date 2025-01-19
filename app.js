// servidor HTTP y rutas CRUD
const express=require('express');
const app=express();
const PORT =3000;
const scrapingRouting=require('./scraping.js');
const fs = require('fs');
const bodyParser = require('body-parser');

// Middleware para parsear JSON
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/',scrapingRouting);



let noticias = [];

  // Leer datos desde el archivo JSON
function leerDatos() {
    try {
      const data = fs.readFileSync('noticias.json', 'utf-8');
      noticias = JSON.parse(data);
      } catch (error) {
      console.error('Error al leer el archivo noticias.json:', error.message);
    }
  }
  
  // Guardar datos en el archivo JSON
  function guardarDatos() {
    fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
  }

  leerDatos();


   //CRUD
  
  // Endpoint --  Obtiene la lista de todos los usuarios.
  app.get('/noticias', (req, res) => {
    res.json(noticias);
  });

  // Obtener todas las noticias
app.get('/noticias', (req, res) => {
    res.json(noticias);
  });
  
  // Obtener una noticia por índice
  app.get('/noticias/:indice', (req, res) => {
    const indice = parseInt(req.params.indice, 10);
    if (indice >= 0 && indice < noticias.length) {
      res.json(noticias[indice]);
    } else {
      res.status(404).json({ error: 'Noticia no encontrada' });
    }
  });
  
  // Crear una nueva noticia
  app.post('/noticias', (req, res) => {
    const { titulo, imagen, descripcion, enlace } = req.body;
    console.log(titulo)
    console.log(enlace)
    if (!titulo || !enlace) {
      return res.status(400).json({ error: 'Título y enlace son requeridos' });
    }
  
    const nuevaNoticia = { titulo, imagen: imagen || 'Sin imagen', descripcion: descripcion || 'Sin descripción', enlace };
    noticias.push(nuevaNoticia);
    guardarDatos();
    res.status(201).json(nuevaNoticia);
  });
  
  // Actualizar una noticia existente
  app.put('/noticias/:indice', (req, res) => {
    const indice = parseInt(req.params.indice, 10);
    if (indice >= 0 && indice < noticias.length) {
      const { titulo, imagen, descripcion, enlace } = req.body;
  
      if (titulo) noticias[indice].titulo = titulo;
      if (imagen) noticias[indice].imagen = imagen;
      if (descripcion) noticias[indice].descripcion = descripcion;
      if (enlace) noticias[indice].enlace = enlace;
  
      guardarDatos();
      res.json(noticias[indice]);
    } else {
      res.status(404).json({ error: 'Noticia no encontrada' });
    }
  });
  
  // Eliminar una noticia
  app.delete('/noticias/:indice', (req, res) => {
    const indice = parseInt(req.params.indice, 10);
    if (indice >= 0 && indice < noticias.length) {
      const noticiaEliminada = noticias.splice(indice, 1);
      guardarDatos();
      res.json({ mensaje: 'Noticia eliminada', noticia: noticiaEliminada[0] });
    } else {
      res.status(404).json({ error: 'Noticia no encontrada' });
    }
  });
  
 
app.listen(PORT, function(err){
    if (err) console.log("Error in server setup")
    console.log(`Server listening on http://localhost:${PORT}`);

})