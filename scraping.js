// Scraping de EL PAÍS

const axios =  require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://elpais.com/ultimas-noticias/';

async function scrapeNoticias() {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        let noticias = [];

        $('.articulo').each((index, element) => {
            const titulo = $(element).find('.titulo').text().trim();
            const descripcion = $(element).find('.entradilla').text().trim();
            const enlace = $(element).find('a').attr('src');
            const imagen = $(element).find('img').attr('src');

            const noticia = {
                titulo,
                imagen,
                descripcion,
                enlace: `https://elpais.com${enlace}`,

            };

            noticias.push(noticia);
        });

        fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
        console.log('Scraping completado y datos guardados en noticias.json');
    } catch (error) {
        console.error('Error al realizar el scraping:', error.message);
    }
}

module.exports = scrapeNoticias;