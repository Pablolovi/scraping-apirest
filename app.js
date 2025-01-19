// servidor HTTP y rutas CRUD

const express = require('express');
const fs = require('fs');
const scrapeNoticias = require('./scraping');

const app = express();
const PORT = 3000;

// Middleware para manejar datos JSON
app.use(express.json());


// middleware para manejar datos de la formularios URL-encoded
app.use(express.urlencoded({ extended: true }));

let noticias = [];


// Leer datos desde archivo JSON
function leerDatos() {
    try {
        const data = fs.readFileSync('noticias.json', 'utf-8');
        noticias = JSON.parse(data);
    } catch (error) {
        console.error('Error al leer el archivo noticia.json:', error.message);
    }
}


// Guardar datos en el formato JSON
function guardarDatos() {
    fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
}


// Ruta para obteber el scraping
app.get('/scraping', async (req, res) => {
    await scrapeNoticias();
    res.send('Scraping comletado y datos guardados en noticias.json');
});


// Ruta para ontener todas las noticias
app.get('/noticias', (req, res) => {
    leerDatos();
    res.json(noticias);
});


// Ruta para obtener una noticia por índice
app.get('/noticias/:index', (req, res) => {
    leerDatos();
    const index = req.params.index;
    if (noticias[index]) {
        res.json(noticias[index]);
    } else {
        res.status(404).send('Noticia no encontrada');
    }
});


// Ruta para crear una nueva noticia
app.post('/noticias', (req, res) => {
    leerDatos();
    const nuevaNoticia = req.body;
    noticias.push(nuevaNoticia);
    guardarDatos();
    res.status(201).send('Noticia creada');
});


// Ruta para actualizar una noticia existente
app.put('/noticias/:index', (req, res) => {
    leerDatos();
    const index = req.params.index;
    if (noticias[index]) {
        noticias[index] = req.body;
        guardarDatos();
        res.send('Noticia actualizada');
    } else {
        res.status(404).send('Noticia no encontrada');
    }
});


// Ruta para eliminar una noticia
app.delete('/noticias/:index', (req, res) => {
    leerDatos();
    const index = req.params.index;
    if (noticias[index]) {
        noticias.splice(index, 1);
        guardarDatos();
        res.send('Noticia eliminada');
    } else {
        res.status(404).send('Noticia no encontrada');
    }
});


app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});