const axios =require('axios');
const cheerio=require('cheerio');
const express=require('express');
const router=express.Router();
const fs = require('fs');


const url=`https://elpais.com/ultimas-noticias/`
       


router.get('/',(req,res)=>{
    axios.get(url).then((response)=>{
        if (response.status===200){
         const htmlData= response.data;
      
           //Cheerio
           const $=cheerio.load(htmlData);
  
           let noticias = [];
           $('article.c.c-d.c--m').each((index,element) => {
             const titulo = $(element).find('h2.c_t').text().trim();
             const enlace = $(element).find('a').attr('href') ? `https://elpais.com${$(element).find('a').attr('href')}` : null;
             const imagen = $(element).find('img').attr('src');
             const descripcion = $(element).find('p').text().trim();
       
             if (titulo && enlace) {
               noticias.push({
                 titulo,
                 imagen: imagen || 'Sin imagen',
                 descripcion: descripcion || 'Sin descripción',
                 enlace,
               });
             }
           });
       
     fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
        
        
        }
    })
  })
  
 

 

  module.exports=router ;